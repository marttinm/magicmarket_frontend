"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    if (username === "alphaTester" && password === "alphaTester123") {
      router.push("/")
    } else {
      toast({
        variant: "destructive",
        title: "Error de autenticación",
        description: "Credenciales inválidas. Por favor, intente nuevamente.",
      })
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Flechas decorativas */}
      <div className="fixed right-0 top-0 h-full w-1/3 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Offline-x6TlpI8DAYVWZZNQM4SOmMwxRKtmoc.png')] bg-cover bg-right" />
      </div>

      <main className="flex-1 flex items-center justify-center p-6 relative">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LogoMagicianColor.jpg-ufakYyKUriJzSS99ETTps17ukAr2Lj.jpeg"
              alt="MagicMarket Logo"
              width={80}
              height={80}
              className="mx-auto mb-4"
            />
            <h1 className="text-4xl font-bold tracking-tight">
              <span className="text-secondary">MAGIC</span>
              <span className="text-primary">MARKET</span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">Bienvenido</p>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-6">
            <div className="space-y-4 bg-card p-6 rounded-lg border shadow-lg">
              <div className="space-y-2">
                <Label htmlFor="username">Usuario</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-background"
                />
              </div>

              <Button type="submit" className="w-full">
                Ingresar
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

