'use client'

import { Apple, Milk, Beef, GlassWater, Cookie, Wheat } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Category } from '@/lib/types'

const iconMap: Record<string, React.ElementType> = {
  apple: Apple,
  milk: Milk,
  beef: Beef,
  'cup-soda': GlassWater,
  cookie: Cookie,
  wheat: Wheat,
}

interface CategoryListProps {
  categories: Category[]
  selectedCategory: string | null
  onSelectCategory: (slug: string | null) => void
}

export function CategoryList({ categories, selectedCategory, onSelectCategory }: CategoryListProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
      <button
        onClick={() => onSelectCategory(null)}
        className={cn(
          "flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors",
          selectedCategory === null
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
        )}
      >
        Tumu
      </button>
      
      {categories.map((category) => {
        const Icon = iconMap[category.icon || ''] || Apple
        return (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.slug)}
            className={cn(
              "flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors",
              selectedCategory === category.slug
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            <Icon className="h-4 w-4" />
            {category.name}
          </button>
        )
      })}
    </div>
  )
}
