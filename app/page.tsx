"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Spinner } from "@/components/ui/spinner"
import Link from "next/link"
import { Shield } from "lucide-react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    // Verificar si el modo testing está activado
    const testingMode = localStorage.getItem("testing-mode") === "true"

    // Si el modo testing está desactivado, redirigir directamente a /market
    if (!testingMode) {
      // Asegurar que el usuario tenga acceso al sitio
      localStorage.setItem("site-access", "true")
      router.push("/market")
      return
    }

    // Si el modo testing está activado, verificar si el usuario ya tiene acceso al sitio
    const siteAccess = localStorage.getItem("site-access") === "true"

    if (siteAccess) {
      // Si tiene acceso al sitio, redirigir a /market
      router.push("/market")
    } else {
      // Si no tiene acceso, mostrar el formulario de login
      setIsLoading(false)
    }
  }, [router])

  // Modificar el handleLogin para redirigir a /home en lugar de /market
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (username === "alphaTester" && password === "alphaTester123") {
        // Establecer acceso al sitio
        localStorage.setItem("site-access", "true")

        toast({
          title: "Acceso concedido",
          description: "Bienvenido a MagicMarket!",
        })

        router.push("/home")
      } else {
        setError("Credenciales inválidas. Por favor, intente nuevamente.")
        toast({
          variant: "destructive",
          title: "Error de autenticación",
          description: "Credenciales inválidas. Por favor, intente nuevamente.",
        })
      }
    } catch (error) {
      console.error("Error durante el inicio de sesión:", error)
      setError("Ocurrió un error al procesar tu solicitud. Por favor, intenta nuevamente.")
      toast({
        variant: "destructive",
        title: "Error de inicio de sesión",
        description: "Ocurrió un error al procesar tu solicitud. Por favor, intenta nuevamente.",
      })
    } finally {
      setLoading(false)
    }
  }

  // Mostrar un estado de carga mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    )
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
            <p className="mt-2 text-sm text-muted-foreground">Iniciar sesión</p>
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
                  disabled={loading}
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
                  disabled={loading}
                />
              </div>

              {error && <div className="bg-destructive/10 text-destructive text-sm p-2 rounded">{error}</div>}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4" />
                    Ingresando...
                  </>
                ) : (
                  "Ingresar"
                )}
              </Button>
            </div>
            <div className="mt-4 text-center">
              <p className="text-xs text-muted-foreground mb-2">Alpha Tester: alphaTester / alphaTester123</p>
              <Link
                href="/admin/login"
                className="text-xs text-primary hover:underline flex items-center justify-center"
              >
                <Shield className="h-3 w-3 mr-1" />
                Acceso para administradores
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

