'use client'

import { Heart } from 'lucide-react'
import { toast } from 'sonner'
import { useApp } from '@/components/app-provider'
import { ProductCard } from '@/components/product-card'

export function FavoritesPage() {
  const { favorites, addToCart, updateCartItem, toggleFavorite, isFavorite, getCartQuantity, user } = useApp()

  const handleAddToCart = async (productId: string) => {
    await addToCart(productId)
    toast.success('Urun sepete eklendi')
  }

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    await updateCartItem(productId, quantity)
  }

  const handleToggleFavorite = async (productId: string) => {
    await toggleFavorite(productId)
    toast.success('Favorilerden cikarildi')
  }

  if (!user) {
    return (
      <div className="px-4 py-6">
        <h1 className="text-2xl font-bold mb-4">Favorilerim</h1>
        <div className="text-center py-12 text-muted-foreground">
          <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Favorileri gormek icin giris yapin</p>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Favorilerim</h1>
        <p className="text-muted-foreground">
          {favorites.length} urun
        </p>
      </header>

      {favorites.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Henuz favori urun eklemediniz</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {favorites.map((favorite) => (
            favorite.product && (
              <ProductCard
                key={favorite.id}
                product={favorite.product}
                isFavorite={isFavorite(favorite.product_id)}
                cartQuantity={getCartQuantity(favorite.product_id)}
                onToggleFavorite={handleToggleFavorite}
                onAddToCart={handleAddToCart}
                onUpdateQuantity={handleUpdateQuantity}
              />
            )
          ))}
        </div>
      )}
    </div>
  )
}
