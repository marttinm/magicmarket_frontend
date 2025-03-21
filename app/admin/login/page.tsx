"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Spinner } from "@/components/ui/spinner"
import { Shield } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AdminLoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { toast } = useToast()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (username === "admin" && password === "nimda") {
        // Establecer sesión de administrador
        localStorage.setItem("admin-session", "true")

        toast({
          title: "Inicio de sesión exitoso",
          description: "Bienvenido, Administrador!",
        })

        // Usar router.push en lugar de window.location para evitar recargas
        router.push("/admin/dashboard")
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

  // Verificar si el admin ya está autenticado
  useEffect(() => {
    const adminSession = localStorage.getItem("admin-session")
    if (adminSession === "true") {
      router.push("/admin/dashboard")
    }
  }, [router])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 flex items-center justify-center p-6 relative">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="mx-auto mb-4 bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Panel de Administración</h1>
            <p className="mt-2 text-sm text-muted-foreground">Acceso restringido</p>
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
          </form>
        </div>
      </main>
    </div>
  )
}

