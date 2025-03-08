"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, Settings, LogOut, User, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CartDialog } from "@/components/cart-dialog"
import { useCart } from "@/components/cart-provider"
import { SteamLoginDialog } from "@/components/steam-login-dialog"
import { useAuth } from "@/components/auth-provider"
import { SteamLogo } from "@/components/steam-logo"
import { useThemeContext } from "@/components/theme-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

export default function Header() {
  const { cartTotal } = useCart()
  const [showCart, setShowCart] = useState(false)
  const { isLoggedIn, logout, user } = useAuth()
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const { theme } = useThemeContext()

  useEffect(() => {
    // Check if user is admin
    const adminSession = localStorage.getItem("admin-session")
    setIsAdmin(adminSession === "true")
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Left section - Logo and brand */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LogoMagicianColor.jpg-ufakYyKUriJzSS99ETTps17ukAr2Lj.jpeg"
              alt="MagicMarket Logo"
              width={32}
              height={32}
              className="rounded-sm"
            />
            <span className="font-bold text-lg">MagicMarket</span>
          </Link>
          <div className="ml-4 text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
            Tema: {theme === "dark" ? "Oscuro Clásico" : "Vibrante Neón"}
          </div>
        </div>

        {/* Center section - Navigation */}
        <nav className="hidden md:flex items-center justify-center">
          <div className="flex gap-1 bg-muted/50 rounded-lg p-1">
            <Link href="/inventory" className="px-4 py-2 rounded-md hover:bg-background/50 transition-colors text-sm">
              Mi Inventario
            </Link>
            <Link href="/dashboard" className="px-4 py-2 rounded-md hover:bg-background/50 transition-colors text-sm">
              Mercado
            </Link>
            {isAdmin && (
              <Link
                href="/admin/dashboard"
                className="px-4 py-2 rounded-md hover:bg-background/50 transition-colors text-sm flex items-center"
              >
                <Shield className="h-3 w-3 mr-1" />
                Admin
              </Link>
            )}
          </div>
        </nav>

        {/* Right section - Actions */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative" onClick={() => setShowCart(true)}>
            <ShoppingCart className="h-5 w-5" />
            {cartTotal > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {cartTotal}
              </span>
            )}
            <span className="sr-only">Carrito</span>
          </Button>

          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <SteamLogo width={20} height={20} inverted={true} />
                  <span>{user?.name || "Usuario Steam"}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Mi cuenta de Steam</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configuración</span>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem onClick={() => router.push("/admin/dashboard")}>
                    <Shield className="mr-2 h-4 w-4" />
                    <span>Panel de Admin</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <SteamLoginDialog />
          )}
        </div>
      </div>

      <CartDialog open={showCart} onOpenChange={setShowCart} />
    </header>
  )
}

