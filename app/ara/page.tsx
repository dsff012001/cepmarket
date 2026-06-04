import { createClient } from '@/lib/supabase/server'
import { AppShell } from '@/components/app-shell'
import { SearchPage } from '@/components/search-page'
import type { Category, Product } from '@/lib/types'

export default async function Ara() {
  const supabase = await createClient()
  
  const [categoriesResult, productsResult] = await Promise.all([
    supabase.from('categories').select('*').order('name'),
    supabase.from('products').select('*, category:categories(*)').order('name'),
  ])

  const categories: Category[] = categoriesResult.data || []
  const products: Product[] = productsResult.data || []

  return (
    <AppShell>
      <SearchPage categories={categories} products={products} />
    </AppShell>
  )
}
