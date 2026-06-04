'use client'

import Image from 'next/image'
import { Heart, Plus, Minus, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { Product } from '@/lib/types'

interface ProductCardProps {
  product: Product
  isFavorite?: boolean
  cartQuantity?: number
  onToggleFavorite?: (productId: string) => void
  onAddToCart?: (productId: string) => void
  onUpdateQuantity?: (productId: string, quantity: number) => void
}

export function ProductCard({
  product,
  isFavorite = false,
  cartQuantity = 0,
  onToggleFavorite,
  onAddToCart,
  onUpdateQuantity,
}: ProductCardProps) {
  return (
    <Card className="overflow-hidden group">
      <div className="relative aspect-square bg-muted">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <ShoppingCart className="h-12 w-12 text-muted-foreground/50" />
          </div>
        )}
        
        <button
          onClick={() => onToggleFavorite?.(product.id)}
          className={cn(
            "absolute top-2 right-2 p-2 rounded-full bg-card/80 backdrop-blur-sm transition-colors",
            isFavorite ? "text-red-500" : "text-muted-foreground hover:text-red-500"
          )}
        >
          <Heart className={cn("h-5 w-5", isFavorite && "fill-current")} />
        </button>

        {product.stock < 10 && product.stock > 0 && (
          <span className="absolute top-2 left-2 bg-accent text-accent-foreground text-xs font-medium px-2 py-1 rounded">
            Son {product.stock} adet
          </span>
        )}

        {product.original_price && product.original_price > product.price && (
          <span className="absolute bottom-2 left-2 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
            %{Math.round((1 - product.price / product.original_price) * 100)} indirim
          </span>
        )}
      </div>

      <div className="p-3 space-y-2">
        <h3 className="font-medium text-sm line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>
        
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-primary">
              {product.price.toLocaleString('tr-TR')} TL
            </span>
            {product.original_price && product.original_price > product.price && (
              <span className="text-xs text-muted-foreground line-through ml-2">
                {product.original_price.toLocaleString('tr-TR')} TL
              </span>
            )}
          </div>
        </div>

        {cartQuantity === 0 ? (
          <Button
            onClick={() => onAddToCart?.(product.id)}
            className="w-full"
            size="sm"
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? 'Stokta Yok' : 'Sepete Ekle'}
          </Button>
        ) : (
          <div className="flex items-center justify-between bg-primary/10 rounded-lg p-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onUpdateQuantity?.(product.id, cartQuantity - 1)}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="font-semibold text-primary">{cartQuantity}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onUpdateQuantity?.(product.id, cartQuantity + 1)}
              disabled={cartQuantity >= product.stock}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}
