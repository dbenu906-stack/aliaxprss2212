import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ManageVivaPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Viva Section Discontinued</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            The Viva section has been consolidated into the main homepage banner management system.
          </p>
          <p className="text-muted-foreground">
            You can now manage all section banners including the former Viva section through the Homepage Banners manager. Upload multiple banners to display them in different sections of your homepage.
          </p>
          <div className="pt-4">
            <Link href="/admin/homepage">
              <Button className="gap-2">
                Go to Homepage Banners <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
