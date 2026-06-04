'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShoppingBag, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'

export default function GirisPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        toast.error('Giris basarisiz. Email veya sifre hatali.')
        return
      }

      toast.success('Giris basarili!')
      router.push('/')
      router.refresh()
    } catch {
      toast.error('Bir hata olustu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col px-4 py-8">
      <Link
        href="/"
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Ana Sayfaya Don
      </Link>

      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <ShoppingBag className="h-10 w-10 text-primary" />
            <span className="text-2xl font-bold">Cep Market</span>
          </div>
          <h1 className="text-xl font-semibold">Giris Yap</h1>
          <p className="text-muted-foreground mt-1">
            Hesabiniza giris yaparak alisverise baslayin
          </p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="ornek@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Sifre</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Sifrenizi girin"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? 'Giris yapiliyor...' : 'Giris Yap'}
            </Button>
          </form>
        </Card>

        <p className="text-center mt-6 text-sm text-muted-foreground">
          Hesabiniz yok mu?{' '}
          <Link href="/kayit" className="text-primary font-medium hover:underline">
            Kayit Ol
          </Link>
        </p>
      </div>
    </div>
  )
}
