"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useThemeContext } from "@/components/theme-context"
import { useToast } from "@/components/ui/use-toast"
import { Moon, Palette, Users, ShoppingCart, Settings, LogOut, BarChart3, Check } from "lucide-react"

export default function AdminDashboardPage() {
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()
  const { theme, setTheme } = useThemeContext()
  const { toast } = useToast()

  useEffect(() => {
    setIsClient(true)
    // Check if admin is logged in
    const adminSession = localStorage.getItem("admin-session")
    if (adminSession !== "true") {
      toast({
        variant: "destructive",
        title: "Acceso denegado",
        description: "No tienes permisos para acceder al panel de administración.",
      })
      router.push("/")
    }
  }, [router, toast])

  const handleLogout = () => {
    localStorage.removeItem("admin-session")
    router.push("/")
  }

  const handleThemeChange = (newTheme: "dark" | "vibrant") => {
    console.log("Changing theme to:", newTheme)
    setTheme(newTheme)
    toast({
      title: "Tema actualizado",
      description: `El tema ha sido cambiado a ${newTheme === "dark" ? "oscuro clásico" : "vibrante con colores neón"}.`,
    })
  }

  if (!isClient) return null

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Panel de Administración</h1>
        <div className="flex items-center gap-4">
          <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm">
            Tema actual: {theme === "dark" ? "Oscuro Clásico" : "Vibrante Neón"}
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar sesión
          </Button>
        </div>
      </div>

      <Tabs defaultValue="theme">
        <TabsList className="mb-6">
          <TabsTrigger value="dashboard">
            <BarChart3 className="h-4 w-4 mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-2" />
            Usuarios
          </TabsTrigger>
          <TabsTrigger value="orders">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Pedidos
          </TabsTrigger>
          <TabsTrigger value="theme">
            <Palette className="h-4 w-4 mr-2" />
            Tema
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Configuración
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Usuarios Totales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-xs text-muted-foreground">+12% desde el mes pasado</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Ventas Totales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">ARS 2,543,000</div>
                <p className="text-xs text-muted-foreground">+5% desde el mes pasado</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pedidos Activos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45</div>
                <p className="text-xs text-muted-foreground">-2% desde el mes pasado</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Items Listados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">789</div>
                <p className="text-xs text-muted-foreground">+8% desde el mes pasado</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Usuarios</CardTitle>
              <CardDescription>Administra los usuarios registrados en la plataforma.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Funcionalidad en desarrollo.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Pedidos</CardTitle>
              <CardDescription>Administra los pedidos realizados en la plataforma.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Funcionalidad en desarrollo.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="theme">
          <Card>
            <CardHeader>
              <CardTitle>Configuración del Tema</CardTitle>
              <CardDescription>Personaliza la apariencia de la plataforma.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Tema del sitio</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card
                      className={`cursor-pointer transition-all ${theme === "dark" ? "ring-2 ring-primary" : ""}`}
                      onClick={() => handleThemeChange("dark")}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="bg-background border-2 border-border p-2 rounded-full">
                            <Moon className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">Tema Oscuro Clásico</h4>
                            <p className="text-sm text-muted-foreground">El tema oscuro original con colores neutros</p>
                          </div>
                          {theme === "dark" && (
                            <div className="bg-primary text-primary-foreground p-1 rounded-full">
                              <Check className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <Card
                      className={`cursor-pointer transition-all ${theme === "vibrant" ? "ring-2 ring-primary" : ""}`}
                      onClick={() => handleThemeChange("vibrant")}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="bg-background border-2 border-border p-2 rounded-full">
                            <Palette className="h-6 w-6 text-accent" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">Tema Vibrante Neón</h4>
                            <p className="text-sm text-muted-foreground">Colores vibrantes con rosa y cian</p>
                          </div>
                          {theme === "vibrant" && (
                            <div className="bg-primary text-primary-foreground p-1 rounded-full">
                              <Check className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Vista previa</h3>
                  <div className="grid gap-4">
                    <div className="p-4 bg-background border rounded-lg">
                      <p className="font-medium">Fondo principal</p>
                    </div>
                    <div className="p-4 bg-card border rounded-lg">
                      <p className="font-medium">Tarjeta</p>
                    </div>
                    <div className="flex gap-2">
                      <Button>Botón primario</Button>
                      <Button variant="secondary">Botón secundario</Button>
                      <Button variant="outline">Botón outline</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Configuración General</CardTitle>
              <CardDescription>Administra la configuración general de la plataforma.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Funcionalidad en desarrollo.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

