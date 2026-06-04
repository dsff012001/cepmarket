'use client'

import { useEffect, useState } from 'react'
import { Package, Clock, CheckCircle, Truck, ChevronDown, ChevronUp } from 'lucide-react'
import { useApp } from '@/components/app-provider'
import { Card } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import type { Order, OrderItem } from '@/lib/types'
import { cn } from '@/lib/utils'

const statusConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  pending: { label: 'Beklemede', icon: Clock, color: 'text-yellow-500' },
  preparing: { label: 'Hazirlaniyor', icon: Package, color: 'text-blue-500' },
  shipping: { label: 'Yolda', icon: Truck, color: 'text-primary' },
  delivered: { label: 'Teslim Edildi', icon: CheckCircle, color: 'text-green-500' },
}

export function OrdersPage() {
  const { user } = useApp()
  const [orders, setOrders] = useState<(Order & { items: OrderItem[] })[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      const { data } = await supabase
        .from('orders')
        .select('*, items:order_items(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      setOrders(data || [])
      setLoading(false)
    }

    fetchOrders()
  }, [user, supabase])

  if (!user) {
    return (
      <div className="px-4 py-6">
        <h1 className="text-2xl font-bold mb-4">Siparislerim</h1>
        <div className="text-center py-12 text-muted-foreground">
          <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Siparisleri gormek icin giris yapin</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="px-4 py-6">
        <h1 className="text-2xl font-bold mb-4">Siparislerim</h1>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-4 animate-pulse">
              <div className="h-4 bg-muted rounded w-1/3 mb-2" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Siparislerim</h1>
        <p className="text-muted-foreground">{orders.length} siparis</p>
      </header>

      {orders.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Henuz siparis vermediniz</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const status = statusConfig[order.status] || statusConfig.pending
            const StatusIcon = status.icon
            const isExpanded = expandedOrder === order.id

            return (
              <Card key={order.id} className="overflow-hidden">
                <button
                  onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                  className="w-full p-4 text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <StatusIcon className={cn("h-4 w-4", status.color)} />
                        <span className={cn("text-sm font-medium", status.color)}>
                          {status.label}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString('tr-TR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-primary">
                        {order.total.toFixed(2)} TL
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 border-t">
                    <div className="pt-4 space-y-3">
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span>
                              {item.product_name} x {item.quantity}
                            </span>
                            <span className="text-muted-foreground">
                              {(item.price * item.quantity).toFixed(2)} TL
                            </span>
                          </div>
                        ))}
                      </div>

                      {order.address && (
                        <div className="text-sm border-t pt-3">
                          <p className="text-muted-foreground">Teslimat Adresi</p>
                          <p>{order.address}</p>
                        </div>
                      )}

                      {order.phone && (
                        <div className="text-sm">
                          <p className="text-muted-foreground">Telefon</p>
                          <p>{order.phone}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
