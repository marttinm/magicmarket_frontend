import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import { CartProvider } from "@/components/cart-provider"
import { AuthProvider } from "@/components/auth-provider"
import { Toaster } from "@/components/toaster"
import { ThemeContextProvider } from "@/components/theme-context"
import { cookies } from "next/headers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MagicMarket CS2",
  description: "Tu marketplace de confianza para CS2",
  icons: {
    icon: [
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LogoMagicianColor.jpg-ufakYyKUriJzSS99ETTps17ukAr2Lj.jpeg",
        href: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LogoMagicianColor.jpg-ufakYyKUriJzSS99ETTps17ukAr2Lj.jpeg",
      },
    ],
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = cookies()
  const isLoggedIn = cookieStore.has("auth")

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeContextProvider>
          <AuthProvider>
            <CartProvider>
              <div className="flex min-h-screen flex-col bg-background">
                {isLoggedIn && <Header />}
                <main className="flex-1">{children}</main>
              </div>
              <Toaster />
            </CartProvider>
          </AuthProvider>
        </ThemeContextProvider>
      </body>
    </html>
  )
}



import './globals.css'