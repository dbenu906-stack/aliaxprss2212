'use server';

import { pool } from '@/lib/mysql';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function addCategory(data: { name: string; image_url: string }) {
  try {
    // Check admin authentication
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');
    
    if (!sessionCookie?.value) {
      return { success: false, message: 'Unauthorized: Please sign in' };
    }

    const user = JSON.parse(sessionCookie.value);
    if (!user.isAdmin) {
      return { success: false, message: 'Unauthorized: Only admins can create categories' };
    }

    const { name, image_url } = data;

    if (!name || !image_url) {
      return { success: false, message: 'Category name and image are required' };
    }

    const connection = await pool.getConnection();
    try {
      const [result] = await connection.execute(
        'INSERT INTO categories (name, image_url) VALUES (?, ?)',
        [name, image_url]
      );

      revalidatePath('/');
      revalidatePath('/admin/manage-categories');

      return { 
        success: true, 
        message: 'Category created successfully!',
        categoryId: (result as any).insertId 
      };
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Add category error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return { success: false, message: `Failed to add category: ${errorMessage}` };
  }
}
