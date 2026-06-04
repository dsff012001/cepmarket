'use client'

import { useState, useMemo } from 'react'
import { Search, X } from 'lucide-react'
import { toast } from 'sonner'
import { useApp } from '@/components/app-provider'
import { ProductCard } from '@/components/product-card'
import { Input } from '@/components/ui/input'
import type { Category, Product } from '@/lib/types'

interface SearchPageProps {
  categories: Category[]
  products: Product[]
}

export function SearchPage({ categories, products }: SearchPageProps) {
  const { user, addToCart, updateCartItem, toggleFavorite, isFavorite, getCartQuantity } = useApp()
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredProducts = useMemo(() => {
    if (!search && !selectedCategory) return []
    
    return products.filter((product) => {
      const matchesSearch = !search || product.name.toLowerCase().includes(search.toLowerCase())
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
  }

  return (
    <div className="px-4 py-6 space-y-6">
      <header>
        <h1 className="text-2xl font-bold mb-4">Urun Ara</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Ne aramistiniz?"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-10 h-12 text-lg bg-secondary border-0"
            autoFocus
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </header>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(
              selectedCategory === category.slug ? null : category.slug
            )}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category.slug
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Results */}
      {(search || selectedCategory) && (
        <section>
          <p className="text-muted-foreground mb-4">
            {filteredProducts.length} sonuc bulundu
          </p>
          
          {filteredProducts.length > 0 ? (
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
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aradiginiz urunu bulamadik</p>
            </div>
          )}
        </section>
      )}

      {!search && !selectedCategory && (
        <div className="text-center py-12 text-muted-foreground">
          <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Aramaya baslamak icin yukariya yazin</p>
        </div>
      )}
    </div>
  )
}
