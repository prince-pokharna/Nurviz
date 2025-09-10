"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingBag, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X,
  Shield,
  Database,
  Upload,
  FileSpreadsheet
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useAdmin } from '@/contexts/admin-context'
import { ADMIN_PERMISSIONS } from '@/lib/admin-config'

const navigation = [
  {
    name: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
    permission: null,
  },
  {
    name: 'Stock Manager',
    href: '/admin/simple-products',
    icon: Package,
    permission: ADMIN_PERMISSIONS.VIEW_PRODUCTS,
    badge: 'Live',
  },
  {
    name: 'Orders',
    href: '/admin/orders',
    icon: ShoppingBag,
    permission: ADMIN_PERMISSIONS.VIEW_ORDERS,
  },
  {
    name: 'Order Book',
    href: '/admin/order-book',
    icon: FileSpreadsheet,
    permission: ADMIN_PERMISSIONS.VIEW_ORDERS,
    badge: 'Excel',
  },
  {
    name: 'Customers',
    href: '/admin/customers',
    icon: Users,
    permission: ADMIN_PERMISSIONS.VIEW_CUSTOMERS,
  },
  {
    name: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
    permission: ADMIN_PERMISSIONS.VIEW_ANALYTICS,
  },
  {
    name: 'Inventory Sync',
    href: '/admin/inventory-sync',
    icon: Upload,
    permission: ADMIN_PERMISSIONS.MANAGE_INVENTORY,
  },
  {
    name: 'Backup',
    href: '/admin/backup',
    icon: Database,
    permission: ADMIN_PERMISSIONS.BACKUP_DATA,
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: Settings,
    permission: ADMIN_PERMISSIONS.MANAGE_SETTINGS,
  },
]

interface AdminNavProps {
  className?: string
}

function NavItems({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname()
  const { admin, hasPermission, logout } = useAdmin()

  const filteredNavigation = navigation.filter(item => 
    !item.permission || hasPermission(item.permission)
  )

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center gap-3 ${mobile ? 'p-4' : 'p-6'} border-b`}>
        <div className="w-8 h-8 bg-gradient-to-br from-[#B4AFA7] to-[#8A8786] rounded-lg flex items-center justify-center">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="font-bold text-lg">Admin Panel</h2>
          <p className="text-sm text-gray-600">Nurvi Jewel</p>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-2">
        {filteredNavigation.map((item) => {
          const isActive = pathname === item.href || 
            (pathname.startsWith(item.href) && item.href !== '/admin/dashboard')

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-gradient-to-r from-[#B4AFA7] to-[#8A8786] text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="flex-1">{item.name}</span>
              {item.badge && (
                <Badge variant="secondary" className="text-xs">
                  {item.badge}
                </Badge>
              )}
            </Link>
          )
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t">
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
            {admin?.name?.charAt(0) || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {admin?.name || 'Admin User'}
            </p>
            <p className="text-xs text-gray-600 truncate">
              {admin?.role?.replace('_', ' ').toUpperCase()}
            </p>
          </div>
        </div>
        
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={logout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}

export default function AdminNav({ className }: AdminNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 ${className}`}>
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 shadow-sm">
          <NavItems />
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between p-4 bg-white border-b">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#B4AFA7] to-[#8A8786] rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-bold">Admin Panel</h1>
          </div>
          
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <NavItems mobile />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>
  )
}
