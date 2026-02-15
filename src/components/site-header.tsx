'use client';

import Link from 'next/link';
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  Package,
  CircleDollarSign,
  MessageSquare,
  CreditCard,
  Heart,
  Ticket,
  Settings,
  Briefcase,
  LogIn,
  HelpCircle,
  ShieldAlert,
  FileText,
  Gavel,
  LayoutDashboard,
  PlusCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
// categories are loaded from AppContext now
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { cn, slugify } from '@/lib/utils';
import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAppContext } from '@/context/AppContext';
import { MainLogo } from './main-logo'; // Corrected import
import { useRouter, usePathname } from 'next/navigation';
import { CountrySelector } from './country-selector'; // Corrected import
import { Icons } from './icons';

const subCategories: { [key: string]: { title: string; items: string[] }[] } = {
  "Women's Fashion": [
    { title: 'Dresses', items: ['Casual', 'Formal', 'Party'] },
    { title: 'Tops', items: ['Blouses', 'T-shirts', 'Tank Tops'] },
    { title: 'Bottoms', items: ['Pants', 'Skirts', 'Shorts'] },
  ],
  "Mens Fashion": [
    { title: 'Tops', items: ['Shirts', 'T-shirts', 'Polos'] },
    { title: 'Bottoms', items: ['Pants', 'Jeans', 'Shorts'] },
    { title: 'Outerwear', items: ['Jackets', 'Coats', 'Vests'] },
  ],
  'Electronics': [
    {
      title: 'Kitchen Fixtures',
      items: [
        'Water Filtration',
        'Kitchen Cabinet Storage',
        'Kitchen Faucets',
        'Kitchen Hardware',
      ],
    },
    {
      title: 'Electrical Equipment & Supplies',
      items: ['Solar Panels', 'Solar Inverters', 'Smart Switches'],
    },
  ],
  'Home & Garden': [
    { title: 'Home Decor', items: ['Vases', 'Candles', 'Rugs'] },
    { title: 'Gardening', items: ['Seeds', 'Tools', 'Pots'] },
  ],
};

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';

export function SiteHeader() {
  const { user, isUserLoading, signOut: handleSignOut, isSeller, isAdmin, categories } = useAppContext();
  const [hoveredCategory, setHoveredCategory] = useState<any | null>(null);
  const [categoryProducts, setCategoryProducts] = useState<any[]>([]);
  const [isCatLoading, setIsCatLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const pathname = usePathname();
  
  // Determine highlighted category based on current route
  useEffect(() => {
    if (pathname === '/' || pathname === '') {
      setSelectedCategory(null);
    } else if (pathname.startsWith('/business')) {
      setSelectedCategory({ name: 'Aliaxpress Business', id: 'business' });
    } else if (pathname.startsWith('/category/')) {
      const categorySlug = pathname.split('/category/')[1];
      const cat = categories?.find(c => slugify(c.name) === categorySlug);
      if (cat) {
        setSelectedCategory(cat);
        handleCategoryHover(cat);
      }
    } else {
      setSelectedCategory(null);
    }
  }, [pathname, categories]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const getInitials = (email: string | null | undefined) => {
    if (!email) return 'G';
    return email.charAt(0).toUpperCase();
  }

  const handleCategoryHover = async (category: any) => {
    setHoveredCategory(category);
    try {
      setIsCatLoading(true);
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      const allProducts = data.data || data || [];
      const prods = allProducts.filter((p: any) => p.category_id === category.id);
      setCategoryProducts(prods);
    } catch (err) {
      setCategoryProducts([]);
    } finally {
      setIsCatLoading(false);
    }
  };

  const displayCategory = hoveredCategory || (selectedCategory && selectedCategory.id !== 'business' ? selectedCategory : null);

  // Keep localStorage sync for backward compatibility
  useEffect(() => {
    if (selectedCategory && selectedCategory.id !== 'business') {
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem('selectedCategory', JSON.stringify(selectedCategory));
        }
      } catch (e) {}
    }
  }, [selectedCategory]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center space-x-2">
              <MainLogo />
            </Link>
          </div>

          <div className="hidden md:flex flex-1 justify-center px-8">
            <form onSubmit={handleSearch} className="relative w-full max-w-2xl">
              <Input
                type="search"
                placeholder="Search for anything..."
                className="w-full rounded-full border-2 border-primary/50 focus:border-primary focus:ring-primary pl-4 pr-12 h-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-0 top-0 h-10 w-10 rounded-r-full rounded-l-none"
              >
                <Search className="h-5 w-5" />
              </Button>
            </form>
          </div>

          <div className="flex items-center justify-end space-x-2 md:space-x-4">
             <CountrySelector />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hidden md:flex flex-col h-auto">
                  <User className="h-5 w-5" />
                  <span className="text-xs">Account</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64" align="end">
                {isUserLoading ? (
                  <DropdownMenuLabel>Loading...</DropdownMenuLabel>
                ) : user ? (
                  <>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex items-center gap-3 p-2">
                         <Avatar>
                          <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
                        </Avatar>
                        <div className='flex flex-col'>
                           <p className="text-sm font-medium leading-none">Welcome back</p>
                           <p className="text-xs leading-none text-muted-foreground truncate">{user.email}</p>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                       {isAdmin && (
                          <DropdownMenuItem asChild>
                              <Link href="/admin">
                                  <LayoutDashboard />
                                  <span>Dashboard</span>
                              </Link>
                          </DropdownMenuItem>
                       )}
                       {(isAdmin || isSeller) && (
                        <DropdownMenuItem onClick={() => router.push('/add-product')} className="cursor-pointer">
                           <PlusCircle className="mr-2 h-4 w-4" />
                           <span>Add Product</span>
                        </DropdownMenuItem>
                       )}
                       <DropdownMenuItem asChild>
                        <Link href="#" className='bg-accent/50 text-primary font-semibold'>
                          <Package />
                          <span>My Orders</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/coins">
                          <CircleDollarSign />
                          <span>My Coins</span>
                        </Link>
                      </DropdownMenuItem>
                       <DropdownMenuItem asChild>
                        <Link href="#">
                          <MessageSquare />
                          <span>Message Center</span>
                        </Link>
                      </DropdownMenuItem>
                       <DropdownMenuItem asChild>
                        <Link href="/payment">
                          <CreditCard />
                          <span>Payment</span>
                        </Link>
                      </DropdownMenuItem>
                       <DropdownMenuItem asChild>
                        <Link href="#">
                          <Heart />
                          <span>Wish List</span>
                        </Link>
                      </DropdownMenuItem>
                       <DropdownMenuItem asChild>
                        <Link href="#">
                          <Ticket />
                          <span>My Coupons</span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                     <DropdownMenuSeparator />
                     <DropdownMenuGroup>
                        <DropdownMenuItem asChild><Link href="#"><Settings /><span>Settings</span></Link></DropdownMenuItem>
                        <DropdownMenuItem asChild><Link href="/business-verification"><Briefcase /><span>Aliaxpress Business</span></Link></DropdownMenuItem>
                        {isSeller && (
                          <DropdownMenuItem asChild>
                              <Link href="/seller">
                                  <LogIn />
                                  <span>Seller Log In</span>
                              </Link>
                          </DropdownMenuItem>
                        )}
                     </DropdownMenuGroup>
                     <DropdownMenuSeparator />
                     <DropdownMenuGroup>
                        <DropdownMenuItem asChild><Link href="#"><FileText /><span>Return & refund policy</span></Link></DropdownMenuItem>
                        <DropdownMenuItem asChild><Link href="#"><HelpCircle /><span>Help Center</span></Link></DropdownMenuItem>
                        <DropdownMenuItem asChild><Link href="#"><ShieldAlert /><span>Disputes & Reports</span></Link></DropdownMenuItem>
                        <DropdownMenuItem asChild><Link href="#"><Gavel /><span>Report IPR infringement</span></Link></DropdownMenuItem>
                     </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      Sign Out
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                     <DropdownMenuLabel className='p-4 text-center'>
                       <p>Welcome to GlobalCart</p>
                       <div className='flex gap-2 mt-2'>
                          <Button asChild className='flex-1'><Link href="/signin">Register</Link></Button>
                          <Button asChild variant="outline" className='flex-1'><Link href="/signin">Sign In</Link></Button>
                       </div>
                     </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                       <DropdownMenuItem asChild>
                        <Link href="#">
                          <Package />
                          <span>My Orders</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="#">
                          <MessageSquare />
                          <span>Message Center</span>
                        </Link>
                      </DropdownMenuItem>
                       <DropdownMenuItem asChild>
                        <Link href="#">
                          <Heart />
                          <span>Wish List</span>
                        </Link>
                      </DropdownMenuItem>
                       <DropdownMenuItem asChild>
                        <Link href="#">
                          <Ticket />
                          <span>My Coupons</span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" size="icon" asChild className="hidden md:flex flex-col h-auto">
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                <span className="text-xs">Cart</span>
              </Link>
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between gap-4 pb-4 md:hidden">
             <form onSubmit={handleSearch} className="relative w-full">
              <Input
                type="search"
                placeholder="Search for anything..."
                className="w-full rounded-full border-2 border-primary/50 focus:border-primary focus:ring-primary pl-4 pr-12 h-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-0 top-0 h-10 w-10 rounded-r-full rounded-l-none"
              >
                <Search className="h-5 w-5" />
              </Button>
            </form>
        </div>
        <div className="md:hidden flex justify-around items-center gap-4 pb-4">
            <Link href="/coins" className="flex flex-col items-center gap-1 text-xs">
                <CircleDollarSign className="w-6 h-6" />
                <span>Coins</span>
            </Link>
            <Link href="/super-deals" className="flex flex-col items-center gap-1 text-xs">
                <Ticket className="w-6 h-6" />
                <span>Super Deals</span>
            </Link>
            <Link href="/prize-land" className="flex flex-col items-center gap-1 text-xs">
                <Heart className="w-6 h-6" />
                <span>Prize Land</span>
            </Link>
        </div>
      </div>
      <nav className="hidden md:block border-t bg-.white">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-6 text-sm h-8">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="p-0 pr-2 bg-transparent hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent">
                    <div className="flex items-center gap-1 hover:text-primary">
                      <Menu className="w-4 h-4" /> All Categories
                    </div>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid grid-cols-[200px_1fr] w-[800px] p-4">
                      <ul className="flex flex-col gap-1 pr-4 border-r">
                        {!categories || categories.length === 0 ? (
                          <li className="p-2 text-sm text-muted-foreground">No categories yet</li>
                        ) : (
                          categories.map((category: any) => {
                            const Icon = Icons[category.icon as keyof typeof Icons];
                            return (
                              <li
                                key={category.id}
                                className="p-2 hover:bg-accent rounded-md cursor-pointer text-sm"
                                onMouseEnter={() => handleCategoryHover(category)}
                                onFocus={() => handleCategoryHover(category)}
                              >
                               <Link
                                  href={`/category/${slugify(category.name)}`}
                                  className="flex items-center gap-2"
                                >
                                  {category.image_url ? (
                                    <img src={category.image_url} alt={category.name} className="w-4 h-4 rounded-sm object-contain" />
                                  ) : (
                                    Icon && <Icon className="w-4 h-4" />
                                  )}
                                  {category.name}
                                </Link>
                              </li>
                            );
                          })
                        )}
                      </ul>
                      <div className="pl-4">
                        {!displayCategory ? (
                          <div className="text-sm text-muted-foreground">Select a category to preview products</div>
                        ) : (
                          <>
                            <h3 className="font-bold mb-2">Products in {displayCategory.name}</h3>
                            <div className="grid grid-cols-2 gap-3">
                              {categoryProducts.length === 0 ? (
                                <div className="col-span-2 text-sm text-muted-foreground">No products found</div>
                              ) : (
                                categoryProducts.slice(0,8).map((p: any) => (
                                  <Link key={p.id} href={`/product/${p.id}`} className="flex items-center gap-2 p-2 rounded hover:bg-accent">
                                    <img src={(p.image_url || p.imageUrls?.[0] || p.imageUrls?.[0]) as string} alt={p.name} className="w-12 h-12 object-cover rounded" />
                                    <div className="text-sm">{p.name}</div>
                                  </Link>
                                ))
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            {/* small horizontal carousel - single Business item inside carousel below */}
            <div className="flex items-center gap-4 overflow-x-auto py-2 px-2">
              <button
                onClick={() => {
                  setSelectedCategory({ name: 'Aliaxpress Business', id: 'business' });
                  router.push('/business');
                }}
                className={
                  `flex-shrink-0 px-3 py-1 rounded text-sm transition-colors ${selectedCategory?.id === 'business' ? 'bg-yellow-200 text-black font-semibold' : 'hover:bg-accent'}`
                }
              >
                Aliaxpress Business
              </button>
              {(categories || []).map((cat: any) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat);
                    router.push(`/category/${slugify(cat.name)}`);
                  }}
                  className={`flex-shrink-0 px-3 py-1 rounded text-sm transition-colors ${selectedCategory?.id === cat.id ? 'bg-yellow-200 text-black font-semibold' : 'hover:bg-accent'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
