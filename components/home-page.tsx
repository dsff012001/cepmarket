'use client'

import { useState, useMemo } from 'react'
import { ShoppingBag } from 'lucide-react'
import { toast } from 'sonner'
import { useApp } from '@/components/app-provider'
import { SearchBar } from '@/components/search-bar'
import { CategoryList } from '@/components/category-list'
import { ProductCard } from '@/components/product-card'
import type { Category, Product } from '@/lib/types'

interface HomePageProps {
  categories: Category[]
  products: Product[]
}

export function HomePage({ categories, products }: HomePageProps) {
  const { user, addToCart, updateCartItem, toggleFavorite, isFavorite, getCartQuantity } = useApp()
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = !selectedCategory || product.category?.slug === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [products, search, selectedCategory])

  const handleAddToCart = async (productId: string) => {
    if (!user) {
      toast.error('Sepete eklemek icin giris yapiniz')
      return
    }
    await addToCart(productId)
    toast.success('Urun sepete eklendi')
  }

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    await updateCartItem(productId, quantity)
  }

  const handleToggleFavorite = async (productId: string) => {
    if (!user) {
      toast.error('Favorilere eklemek icin giris yapiniz')
      return
    }
    await toggleFavorite(productId)
    const wasInFavorites = isFavorite(productId)
    toast.success(wasInFavorites ? 'Favorilerden cikarildi' : 'Favorilere eklendi')
  }

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Header */}
      <header className="space-y-1">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-balance">Cep Market</h1>
        </div>
        <p className="text-muted-foreground">
          Taze urunler, hizli teslimat
        </p>
      </header>

      {/* Search */}
      <SearchBar value={search} onChange={setSearch} />

      {/* Categories */}
      <CategoryList
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Products */}
      <section>
        <h2 className="text-lg font-semibold mb-4">
          {selectedCategory
            ? categories.find((c) => c.slug === selectedCategory)?.name
            : 'Tum Urunler'}
          <span className="text-muted-foreground font-normal ml-2">
            ({filteredProducts.length} urun)
          </span>
        </h2>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <ShoppingBag className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Urun bulunamadi</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isFavorite={isFavorite(product.id)}
                cartQuantity={getCartQuantity(product.id)}
                onToggleFavorite={handleToggleFavorite}
                onAddToCart={handleAddToCart}
                onUpdateQuantity={handleUpdateQuantity}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
