export interface Category {
  id: string
  name: string
  slug: string
  icon: string | null
  created_at: string
}

export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  original_price: number | null
  image_url: string | null
  category_id: string | null
  seller_id: string | null
  stock: number
  is_featured: boolean
  created_at: string
  updated_at: string
  category?: Category
}

export interface CartItem {
  id: string
  user_id: string
  product_id: string
  quantity: number
  created_at: string
  product?: Product
}

export interface Favorite {
  id: string
  user_id: string
  product_id: string
  created_at: string
  product?: Product
}

export interface Order {
  id: string
  user_id: string
  total: number
  status: string
  address: string | null
  phone: string | null
  created_at: string
  items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string | null
  product_name: string
  price: number
  quantity: number
  created_at: string
}
