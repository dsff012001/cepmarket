'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { User, Package, Heart, LogOut, LogIn, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import { useApp } from '@/components/app-provider'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'

const menuItems = [
  { href: '/siparisler', icon: Package, label: 'Siparislerim' },
  { href: '/favoriler', icon: Heart, label: 'Favorilerim' },
]

export function ProfilePage() {
  const router = useRouter()
  const { user } = useApp()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    toast.success('Cikis yapildi')
    router.push('/')
    router.refresh()
  }

  if (!user) {
    return (
      <div className="px-4 py-6 space-y-6">
        <header>
          <h1 className="text-2xl font-bold">Hesabim</h1>
        </header>

        <div className="text-center py-12">
          <User className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
          <h2 className="text-lg font-semibold mb-2">Hosgeldiniz!</h2>
          <p className="text-muted-foreground mb-6">
            Alisverise baslamak icin giris yapin veya kayit olun
          </p>
          <div className="flex flex-col gap-3 max-w-xs mx-auto">
            <Button asChild size="lg">
              <Link href="/giris">
                <LogIn className="h-4 w-4 mr-2" />
                Giris Yap
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/kayit">
                Kayit Ol
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Hesabim</h1>
      </header>

      {/* User Info */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-7 w-7 text-primary" />
          </div>
          <div>
            <p className="font-semibold">{user.email}</p>
            <p className="text-sm text-muted-foreground">
              Uye tarih: {new Date(user.created_at).toLocaleDateString('tr-TR')}
            </p>
          </div>
        </div>
      </Card>

      {/* Menu */}
      <Card className="divide-y">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <item.icon className="h-5 w-5 text-muted-foreground" />
              <span>{item.label}</span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        ))}
      </Card>

      {/* Sign Out */}
      <Button
        variant="outline"
        className="w-full"
        onClick={handleSignOut}
      >
        <LogOut className="h-4 w-4 mr-2" />
        Cikis Yap
      </Button>
    </div>
  )
}
