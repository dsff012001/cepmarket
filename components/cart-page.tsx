'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useApp } from '@/components/app-provider'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'

export function CartPage() {
  const router = useRouter()
  const { cartItems, cartTotal, updateCartItem, removeFromCart, clearCart, user } = useApp()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const supabase = createClient()

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    await updateCartItem(productId, quantity)
  }

  const handleRemove = async (productId: string) => {
    await removeFromCart(productId)
    toast.success('Urun sepetten cikarildi')
  }

  const handleCheckout = async () => {
    if (!user) return
    if (!address.trim() || !phone.trim()) {
      toast.error('Adres ve telefon bilgilerini giriniz')
      return
    }

    setIsCheckingOut(true)

    try {
      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total: cartTotal,
          address,
          phone,
          status: 'pending',
        })
        .select()
        .single()

      if (orderError) throw orderError

      // Create order items
      const orderItems = cartItems.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.product?.name || '',
        price: item.product?.price || 0,
        quantity: item.quantity,
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) throw itemsError

      // Clear cart
      await clearCart()

      toast.success('Siparisiniz alindi!')
      router.push('/siparisler')
    } catch (error) {
      console.error('Checkout error:', error)
      toast.error('Siparis olusturulurken bir hata olustu')
    } finally {
      setIsCheckingOut(false)
    }
  }

  if (!user) {
    return (
      <div className="px-4 py-6">
        <h1 className="text-2xl font-bold mb-4">Sepetim</h1>
        <div className="text-center py-12 text-muted-foreground">
          <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Sepeti gormek icin giris yapin</p>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Sepetim</h1>
        <p className="text-muted-foreground">
          {cartItems.length} urun
        </p>
      </header>

      {cartItems.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Sepetiniz bos</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {cartItems.map((item) => (
              <Card key={item.id} className="p-3">
                <div className="flex gap-3">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    {item.product?.image_url ? (
                      <Image
                        src={item.product.image_url}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingCart className="h-8 w-8 text-muted-foreground/50" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm line-clamp-2">
                      {item.product?.name}
                    </h3>
                    <p className="text-primary font-semibold mt-1">
                      {item.product?.price.toFixed(2)} TL
                      <span className="text-xs text-muted-foreground font-normal ml-1">
                        / {item.product?.unit}
                      </span>
                    </p>
                  </div>

                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => handleRemove(item.product_id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    
                    <div className="flex items-center gap-2 bg-secondary rounded-lg p-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleUpdateQuantity(item.product_id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-6 text-center font-semibold text-sm">
                        {item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleUpdateQuantity(item.product_id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Delivery Info */}
          <Card className="p-4 space-y-4">
            <h2 className="font-semibold">Teslimat Bilgileri</h2>
            
            <div className="space-y-2">
              <Label htmlFor="address">Adres</Label>
              <Input
                id="address"
                placeholder="Teslimat adresinizi girin"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefon</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="05XX XXX XX XX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </Card>

          {/* Summary */}
          <Card className="p-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Ara Toplam</span>
                <span>{cartTotal.toFixed(2)} TL</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Teslimat</span>
                <span className="text-primary">Ucretsiz</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Toplam</span>
                  <span className="text-primary">{cartTotal.toFixed(2)} TL</span>
                </div>
              </div>
            </div>

            <Button
              className="w-full mt-4"
              size="lg"
              onClick={handleCheckout}
              disabled={isCheckingOut}
            >
              {isCheckingOut ? 'Siparis olusturuluyor...' : 'Siparisi Tamamla'}
            </Button>
          </Card>
        </>
      )}
    </div>
  )
}
