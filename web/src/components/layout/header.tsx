'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Scale, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Início', href: '/' },
  { name: 'Upload', href: '/upload' },
  { name: 'Contratos', href: '/contracts' },
  { name: 'Templates', href: '/templates' },
  { name: 'Documentos', href: '/documents' },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-secondary-200 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <Scale className="h-8 w-8 text-primary-600 transition-transform group-hover:scale-110" />
                <div className="absolute -inset-1 bg-primary-600/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="text-xl font-bold text-secondary-900">
                Adv<span className="text-primary-600">Helper</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative',
                  pathname === item.href
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100',
                )}
              >
                {item.name}
                {pathname === item.href && (
                  <div className="absolute inset-x-0 -bottom-px h-px bg-primary-600" />
                )}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" size="sm">
              Entrar
            </Button>
            <Button size="sm">Começar Agora</Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden animate-slide-up">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'block px-3 py-2 rounded-lg text-base font-medium transition-colors',
                    pathname === item.href
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100',
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex flex-col space-y-2 pt-4">
                <Button variant="outline" className="w-full">
                  Entrar
                </Button>
                <Button className="w-full">Começar Agora</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
