'use client'

import { BottomNav } from '@/components/bottom-nav'
import { AppProvider, useApp } from '@/components/app-provider'

function ShellContent({ children }: { children: React.ReactNode }) {
  const { cartCount } = useApp()
  
  return (
    <div className="min-h-screen pb-20">
      <main>{children}</main>
      <BottomNav cartCount={cartCount} />
    </div>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <ShellContent>{children}</ShellContent>
    </AppProvider>
  )
}
