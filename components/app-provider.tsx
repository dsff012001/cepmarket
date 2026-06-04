'use client'

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import type { CartItem, Favorite } from '@/lib/types'

interface AppContextType {
  user: User | null
  loading: boolean
  cartItems: CartItem[]
  favorites: Favorite[]
  cartCount: number
  cartTotal: number
  refreshCart: () => Promise<void>
  refreshFavorites: () => Promise<void>
  addToCart: (productId: string, quantity?: number) => Promise<void>
  updateCartItem: (productId: string, quantity: number) => Promise<void>
  removeFromCart: (productId: string) => Promise<void>
  clearCart: () => Promise<void>
  toggleFavorite: (productId: string) => Promise<void>
  isFavorite: (productId: string) => boolean
  getCartQuantity: (productId: string) => number
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [favorites, setFavorites] = useState<Favorite[]>([])
  
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const refreshCart = useCallback(async () => {
    if (!user) {
      setCartItems([])
      return
    }

    const { data } = await supabase
      .from('cart_items')
      .select('*, product:products(*)')
      .eq('user_id', user.id)

    setCartItems(data || [])
  }, [user, supabase])

  const refreshFavorites = useCallback(async () => {
    if (!user) {
      setFavorites([])
      return
    }

    const { data } = await supabase
      .from('favorites')
      .select('*, product:products(*)')
      .eq('user_id', user.id)

    setFavorites(data || [])
  }, [user, supabase])

  useEffect(() => {
    if (user) {
      refreshCart()
      refreshFavorites()
    } else {
      setCartItems([])
      setFavorites([])
    }
  }, [user, refreshCart, refreshFavorites])

  const addToCart = async (productId: string, quantity = 1) => {
    if (!user) return

    const existingItem = cartItems.find(item => item.product_id === productId)
    
    if (existingItem) {
      await updateCartItem(productId, existingItem.quantity + quantity)
    } else {
      await supabase
        .from('cart_items')
        .insert({ user_id: user.id, product_id: productId, quantity })
      
      await refreshCart()
    }
  }

  const updateCartItem = async (productId: string, quantity: number) => {
    if (!user) return

    if (quantity <= 0) {
      await removeFromCart(productId)
      return
    }

    await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('user_id', user.id)
      .eq('product_id', productId)

    await refreshCart()
  }

  const removeFromCart = async (productId: string) => {
    if (!user) return

    await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productId)

    await refreshCart()
  }

  const clearCart = async () => {
    if (!user) return

    await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.id)

    setCartItems([])
  }

  const toggleFavorite = async (productId: string) => {
    if (!user) return

    const existing = favorites.find(f => f.product_id === productId)

    if (existing) {
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId)
    } else {
      await supabase
        .from('favorites')
        .insert({ user_id: user.id, product_id: productId })
    }

    await refreshFavorites()
  }

  const isFavorite = (productId: string) => {
    return favorites.some(f => f.product_id === productId)
  }

  const getCartQuantity = (productId: string) => {
    const item = cartItems.find(item => item.product_id === productId)
    return item?.quantity || 0
  }

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = cartItems.reduce((sum, item) => {
    const price = item.product?.price || 0
    return sum + price * item.quantity
  }, 0)

  return (
    <AppContext.Provider
      value={{
        user,
        loading,
        cartItems,
        favorites,
        cartCount,
        cartTotal,
        refreshCart,
        refreshFavorites,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        toggleFavorite,
        isFavorite,
        getCartQuantity,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
