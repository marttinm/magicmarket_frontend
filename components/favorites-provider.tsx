"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"

export type FavoriteItem = {
  id: number
  name: string
  price: number
  image?: string
  type?: string
  isAvailable: boolean
  dateAdded: Date
}

type FavoritesContextType = {
  favorites: FavoriteItem[]
  addToFavorites: (item: Omit<FavoriteItem, "dateAdded" | "isAvailable">) => void
  removeFromFavorites: (id: number) => void
  isFavorite: (id: number) => boolean
  favoritesCount: number
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])
  const [favoritesCount, setFavoritesCount] = useState(0)
  const { toast } = useToast()

  // Cargar favoritos desde localStorage al iniciar
  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem("favorites")
      if (storedFavorites) {
        const parsedFavorites = JSON.parse(storedFavorites)
        // Convertir las fechas de string a Date
        const favoritesWithDates = parsedFavorites.map((fav: any) => ({
          ...fav,
          dateAdded: new Date(fav.dateAdded),
        }))
        setFavorites(favoritesWithDates)
      }
    } catch (error) {
      console.error("Error loading favorites:", error)
    }
  }, [])

  // Actualizar localStorage cuando cambian los favoritos
  useEffect(() => {
    setFavoritesCount(favorites.length)
    localStorage.setItem("favorites", JSON.stringify(favorites))
  }, [favorites])

  const addToFavorites = (item: Omit<FavoriteItem, "dateAdded" | "isAvailable">) => {
    if (isFavorite(item.id)) {
      toast({
        title: "Ya en favoritos",
        description: `${item.name} ya está en tu lista de favoritos`,
      })
      return
    }

    const newFavorite: FavoriteItem = {
      ...item,
      isAvailable: true,
      dateAdded: new Date(),
    }

    setFavorites((prev) => [...prev, newFavorite])

    toast({
      title: "Añadido a favoritos",
      description: `${item.name} se ha añadido a tu lista de favoritos`,
    })
  }

  const removeFromFavorites = (id: number) => {
    const itemToRemove = favorites.find((item) => item.id === id)

    setFavorites((prev) => prev.filter((item) => item.id !== id))

    if (itemToRemove) {
      toast({
        title: "Eliminado de favoritos",
        description: `${itemToRemove.name} se ha eliminado de tu lista de favoritos`,
      })
    }
  }

  const isFavorite = (id: number) => {
    return favorites.some((item) => item.id === id)
  }

  return (
    <FavoritesContext.Provider value={{ favorites, addToFavorites, removeFromFavorites, isFavorite, favoritesCount }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider")
  }
  return context
}

