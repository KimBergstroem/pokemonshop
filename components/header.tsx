"use client";

import { useState, useEffect, useRef } from "react";
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
import { CDN } from "@/lib/cdn";

// Scroll configuration constants
const SCROLL_CONFIG = {
  SCROLL_DELTA_THRESHOLD: 10, // Minimum scroll distance before navbar state changes
  SHOW_DELAY: 200, // Time to wait before showing navbar on scroll up (ms)
  HIDE_THRESHOLD: 100, // Minimum scroll position before hiding navbar
  THROTTLE_INTERVAL: 16, // Throttle interval for scroll events (~60fps)
  MOMENTUM_SCROLL_IGNORE: 300, // Time to ignore scroll events after touch end (ms)
  DIRECTION_STABILITY: 100, // Minimum consistent scroll direction time before state change (ms)
  TOP_THRESHOLD: 10, // Always show navbar when scroll position is below this
};

export function Header() {
  const { data: session, status } = useSession() || {};
  const { cart } = useCart();
  const { t } = useLanguage();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Scroll-aware navbar state
  const [isVisible, setIsVisible] = useState(true);
  
  // Use refs instead of state to prevent useEffect re-runs
  const lastScrollYRef = useRef(0);
  const scrollDirectionRef = useRef<'up' | 'down' | null>(null);
  const directionChangeTimeRef = useRef(0);
  const showTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastThrottleTimeRef = useRef(0);
  const touchEndTimeRef = useRef(0);
  const isScrollingRef = useRef(false);

  const cartItemsCount =
    cart?.reduce((total, item) => total + (item?.quantity ?? 0), 0) ?? 0;

  const navItems = [
    { href: "/", label: t.nav.home },
    { href: "/about", label: t.nav.about },
    { href: "/marketplace", label: t.nav.marketplace },
    { href: "/blog", label: t.nav.blog },
    { href: "/support", label: t.nav.contact },
  ];

  // Scroll-aware navbar logic with optimizations
  useEffect(() => {
    const handleScroll = () => {
      const now = Date.now();
      const currentScrollY = window.scrollY;
      
      // Throttle scroll events to ~60fps
      if (now - lastThrottleTimeRef.current < SCROLL_CONFIG.THROTTLE_INTERVAL) {
        return;
      }
      lastThrottleTimeRef.current = now;

      // Ignore scroll events during momentum scrolling (after touch end)
      if (now - touchEndTimeRef.current < SCROLL_CONFIG.MOMENTUM_SCROLL_IGNORE) {
        return;
      }

      // Always show navbar at the top of the page
      if (currentScrollY < SCROLL_CONFIG.TOP_THRESHOLD) {
        if (showTimeoutRef.current) {
          clearTimeout(showTimeoutRef.current);
          showTimeoutRef.current = null;
        }
        setIsVisible(true);
        lastScrollYRef.current = currentScrollY;
        scrollDirectionRef.current = null;
        return;
      }

      // Calculate scroll delta
      const scrollDelta = Math.abs(currentScrollY - lastScrollYRef.current);
      
      // Ignore micro-movements below threshold
      if (scrollDelta < SCROLL_CONFIG.SCROLL_DELTA_THRESHOLD) {
        return;
      }

      // Determine scroll direction
      const isScrollingDown = currentScrollY > lastScrollYRef.current;
      const currentDirection = isScrollingDown ? 'down' : 'up';

      // Track direction stability
      if (scrollDirectionRef.current !== currentDirection) {
        scrollDirectionRef.current = currentDirection;
        directionChangeTimeRef.current = now;
      }

      // Require direction stability before changing navbar state
      const directionStableTime = now - directionChangeTimeRef.current;
      if (directionStableTime < SCROLL_CONFIG.DIRECTION_STABILITY) {
        lastScrollYRef.current = currentScrollY;
        return;
      }

      // Handle scrolling down - hide navbar immediately
      if (isScrollingDown && currentScrollY > SCROLL_CONFIG.HIDE_THRESHOLD) {
        if (showTimeoutRef.current) {
          clearTimeout(showTimeoutRef.current);
          showTimeoutRef.current = null;
        }
        setIsVisible(false);
      }
      // Handle scrolling up - show navbar with delay
      else if (!isScrollingDown) {
        // Clear any existing timeout
        if (showTimeoutRef.current) {
          clearTimeout(showTimeoutRef.current);
        }
        // Set timeout to show navbar after delay
        showTimeoutRef.current = setTimeout(() => {
          setIsVisible(true);
          showTimeoutRef.current = null;
        }, SCROLL_CONFIG.SHOW_DELAY);
      }

      lastScrollYRef.current = currentScrollY;
    };

    // Handle touch events to detect momentum scrolling
    const handleTouchStart = () => {
      isScrollingRef.current = true;
      if (showTimeoutRef.current) {
        clearTimeout(showTimeoutRef.current);
        showTimeoutRef.current = null;
      }
    };

    const handleTouchEnd = () => {
      touchEndTimeRef.current = Date.now();
      isScrollingRef.current = false;
    };

    // Add event listeners
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    // Cleanup: remove event listeners when component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
      if (showTimeoutRef.current) {
        clearTimeout(showTimeoutRef.current);
      }
    };
  }, []); // Empty dependency array - effect only runs once

  return (
    <header 
      className={`sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 transition-transform duration-300 ease-in-out ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="flex items-center justify-between h-20 sm:h-24 md:h-28 lg:h-32 xl:h-36">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center h-full group transition-transform hover:scale-105 flex-shrink-0 max-w-[60%] sm:max-w-none">
            <Image
              src={CDN.logoNavbar}
              alt="akkNERDS TRADING CO."
              width={480}
              height={480}
              className="h-16 sm:h-20 md:h-24 lg:h-32 xl:h-36 w-auto object-contain"
              priority
              unoptimized
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                prefetch={true}
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
                  prefetch={true}
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
