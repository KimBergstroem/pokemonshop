"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { ShoppingCart, Menu, X, User, LogOut, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cart-context";
import { useLanguage } from "@/contexts/language-context";
import { LanguageSelector } from "./language-selector";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  const { data: session, status } = useSession() || {};
  const { cart } = useCart();
  const { t } = useLanguage();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartItemsCount =
    cart?.reduce((total, item) => total + (item?.quantity ?? 0), 0) ?? 0;

  const navItems = [
    { href: "/", label: t.nav.home },
    { href: "/about", label: t.nav.about },
    { href: "/marketplace", label: t.nav.marketplace },
    { href: "/blog", label: t.nav.blog },
    { href: "/contact", label: t.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="flex items-center justify-between h-24 sm:h-28 md:h-32 lg:h-36 xl:h-40">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center h-full group transition-transform hover:scale-105 flex-shrink-0">
            <Image
              src="/logo1.svg"
              alt="akkNERDS TRADING CO."
              width={480}
              height={480}
              className="h-32 sm:h-24 md:h-32 lg:h-48 xl:h-32 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  pathname === item.href
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}>
                {item.label}
                {pathname === item.href && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary/0 hover:bg-primary/30 rounded-full transition-all duration-200 scale-x-0 hover:scale-x-100" />
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-1">
            <div className="hidden md:flex items-center gap-1 border-r border-border/40 pr-2 mr-2">
              <LanguageSelector />
              <ThemeToggle />
            </div>

            <div className="flex items-center gap-1">
              <Link href="/cart">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative h-10 w-10 hover:bg-primary/10 hover:text-primary transition-colors">
                  <ShoppingCart className="w-5 h-5" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-lg">
                      {cartItemsCount}
                    </span>
                  )}
                </Button>
              </Link>

              {status === "authenticated" ? (
                <>
                  <Link href="/orders">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 hover:bg-primary/10 hover:text-primary transition-colors">
                      <Package className="w-5 h-5" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 hover:bg-primary/10 hover:text-primary transition-colors"
                    onClick={() => signOut({ callbackUrl: "/" })}>
                    <LogOut className="w-5 h-5" />
                  </Button>
                </>
              ) : (
                <Link href="/auth/signin">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 hover:bg-primary/10 hover:text-primary transition-colors">
                    <User className="w-5 h-5" />
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-10 w-10 ml-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border/40 py-4">
            <div className="flex items-center justify-between mb-4 px-2">
              <LanguageSelector />
              <ThemeToggle />
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg transition-all duration-200 ${
                    pathname === item.href
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
