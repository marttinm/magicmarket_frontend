"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"

type CartItem = {
  id: number
  name: string
  price: number
  quantity: number
}

type CartContextType = {
  cart: CartItem[]
  addToCart: (product: { id: number; name: string; price: number }) => void
  removeFromCart: (id: number) => void
  cartTotal: number
  cartTotalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartTotal, setCartTotal] = useState(0)
  const [cartTotalPrice, setCartTotalPrice] = useState(0)
  const { toast } = useToast()

  useEffect(() => {
    const total = cart.reduce((sum, item) => sum + item.quantity, 0)
    setCartTotal(total)

    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    setCartTotalPrice(totalPrice)
  }, [cart])

  const addToCart = (product: { id: number; name: string; price: number }) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.id === product.id)
      if (existingItem) {
        toast({
          title: "Item actualizado en el carrito",
          description: `Se ha incrementado la cantidad de ${product.name} en el carrito`,
        })
        return currentCart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      }
      toast({
        title: "Item agregado al carrito",
        description: `${product.name} se ha agregado al carrito`,
      })
      return [...currentCart, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (id: number) => {
    setCart((currentCart) => {
      const itemToRemove = currentCart.find((item) => item.id === id)
      if (itemToRemove) {
        toast({
          title: "Item eliminado del carrito",
          description: `${itemToRemove.name} se ha eliminado del carrito`,
        })
      }
      return currentCart.filter((item) => item.id !== id)
    })
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, cartTotal, cartTotalPrice }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

