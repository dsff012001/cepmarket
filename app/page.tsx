import { createClient } from '@/lib/supabase/server'
import { AppShell } from '@/components/app-shell'
import { HomePage } from '@/components/home-page'
import type { Category, Product } from '@/lib/types'

export default async function Home() {
  const supabase = await createClient()
  
  const [categoriesResult, productsResult] = await Promise.all([
    supabase.from('categories').select('*').order('name'),
    supabase.from('products').select('*, category:categories(*)').order('created_at', { ascending: false }),
  ])

  const categories: Category[] = categoriesResult.data || []
  const products: Product[] = productsResult.data || []

  return (
    <AppShell>
      <HomePage categories={categories} products={products} />
    </AppShell>
  )
}
