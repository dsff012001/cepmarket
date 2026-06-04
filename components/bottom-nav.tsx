'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, Heart, ShoppingCart, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', icon: Home, label: 'Ana Sayfa' },
  { href: '/ara', icon: Search, label: 'Ara' },
  { href: '/favoriler', icon: Heart, label: 'Favoriler' },
  { href: '/sepet', icon: ShoppingCart, label: 'Sepet' },
  { href: '/profil', icon: User, label: 'Profil' },
]

interface BottomNavProps {
  cartCount?: number
}

export function BottomNav({ cartCount = 0 }: BottomNavProps) {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border safe-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/' && pathname.startsWith(item.href))
          const Icon = item.icon
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 w-16 h-full transition-colors relative",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="relative">
                <Icon className="h-5 w-5" />
                {item.href === '/sepet' && cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
