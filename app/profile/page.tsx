"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { User, ShoppingBag, CreditCard, LogOut, AlertCircle, CheckCircle, Clock } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"

export default function ProfilePage() {
  const { toast } = useToast()
  const [userData, setUserData] = useState({
    firstName: "Juan",
    lastName: "Pérez",
    email: "juan.perez@example.com",
    phone: "+1 (555) 123-4567",
  })

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
  })

  const [activeTab, setActiveTab] = useState("personal")

  const validateForm = () => {
    const newErrors = {
      firstName: "",
      lastName: "",
      email: "",
    }

    let isValid = true

    if (!userData.firstName.trim()) {
      newErrors.firstName = "El nombre es requerido"
      isValid = false
    }

    if (!userData.lastName.trim()) {
      newErrors.lastName = "El apellido es requerido"
      isValid = false
    }

    if (!userData.email.trim()) {
      newErrors.email = "El email es requerido"
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      newErrors.email = "Email inválido"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserData((prev) => ({ ...prev, [name]: value }))

    // Limpiar error al escribir
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      // Aquí iría la lógica para guardar los cambios
      toast({
        title: "Perfil actualizado",
        description: "Tu información personal ha sido actualizada correctamente.",
      })
    }
  }

  // Datos de ejemplo para las compras
  const purchases = [
    {
      id: "ORD-2023-001",
      date: "15/03/2023",
      items: [
        {
          id: 1,
          name: "AWP | Neo-Noir",
          price: 125000,
          image: "/placeholder.svg?height=60&width=60",
        },
      ],
      status: "completed",
      total: 125000,
    },
    {
      id: "ORD-2023-002",
      date: "22/04/2023",
      items: [
        {
          id: 2,
          name: "AK-47 | Vulcan",
          price: 87500,
          image: "/placeholder.svg?height=60&width=60",
        },
        {
          id: 3,
          name: "USP-S | Kill Confirmed",
          price: 45000,
          image: "/placeholder.svg?height=60&width=60",
        },
      ],
      status: "completed",
      total: 132500,
    },
    {
      id: "ORD-2023-003",
      date: "10/05/2023",
      items: [
        {
          id: 4,
          name: "Butterfly Knife | Fade",
          price: 750000,
          image: "/placeholder.svg?height=60&width=60",
        },
      ],
      status: "pending",
      total: 750000,
    },
  ]

  // Datos de ejemplo para los métodos de pago
  const paymentMethods = [
    {
      id: 1,
      type: "mercadopago",
      name: "MercadoPago",
      email: "juan.perez@example.com",
      isDefault: true,
    },
    {
      id: 2,
      type: "bank",
      name: "Transferencia Bancaria",
      accountNumber: "•••• •••• •••• 4567",
      bank: "Santander",
      isDefault: false,
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-500/20 text-green-500 border-green-500/50">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completada
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-500/20 text-yellow-500 border-yellow-500/50">
            <Clock className="h-3 w-3 mr-1" />
            Pendiente
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleDeletePaymentMethod = (id: number) => {
    // Aquí iría la lógica para eliminar el método de pago
    toast({
      title: "Método de pago eliminado",
      description: "El método de pago ha sido eliminado correctamente.",
    })
  }

  const handleSetDefaultPaymentMethod = (id: number) => {
    // Aquí iría la lógica para establecer el método de pago por defecto
    toast({
      title: "Método de pago actualizado",
      description: "El método de pago predeterminado ha sido actualizado.",
    })
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 shrink-0">
          <div className="sticky top-20 space-y-1">
            <h2 className="text-xl font-bold mb-4">Mi cuenta</h2>
            <Button
              variant={activeTab === "personal" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("personal")}
            >
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Perfil</span>
              </div>
            </Button>
            <Button
              variant={activeTab === "purchases" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("purchases")}
            >
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                <span>Mis compras</span>
              </div>
            </Button>
            <Button
              variant={activeTab === "payment" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("payment")}
            >
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <span>Métodos de pago</span>
              </div>
            </Button>
            <Separator className="my-4" />
            <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive" asChild>
              <div className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                <span>Cerrar sesión</span>
              </div>
            </Button>
          </div>
        </aside>

        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-6">Mi perfil</h1>

          {activeTab === "personal" && (
            <Card>
              <CardHeader>
                <CardTitle>Información personal</CardTitle>
                <CardDescription>
                  Actualiza tu información personal. Esta información será visible para otros usuarios.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">
                          Nombre <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={userData.firstName}
                          onChange={handleChange}
                          className={errors.firstName ? "border-destructive" : ""}
                        />
                        {errors.firstName && (
                          <p className="text-destructive text-sm flex items-center mt-1">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {errors.firstName}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">
                          Apellido <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={userData.lastName}
                          onChange={handleChange}
                          className={errors.lastName ? "border-destructive" : ""}
                        />
                        {errors.lastName && (
                          <p className="text-destructive text-sm flex items-center mt-1">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {errors.lastName}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">
                        Email <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={userData.email}
                        onChange={handleChange}
                        className={errors.email ? "border-destructive" : ""}
                      />
                      {errors.email && (
                        <p className="text-destructive text-sm flex items-center mt-1">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input id="phone" name="phone" value={userData.phone} onChange={handleChange} />
                    </div>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleSubmit}>Guardar cambios</Button>
              </CardFooter>
            </Card>
          )}

          {activeTab === "purchases" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Historial de compras</CardTitle>
                  <CardDescription>Revisa el historial de tus compras realizadas en MagicMarket.</CardDescription>
                </CardHeader>
                <CardContent>
                  {purchases.length === 0 ? (
                    <div className="text-center py-6">
                      <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-medium">No hay compras recientes</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Cuando realices compras, aparecerán aquí para que puedas hacer un seguimiento.
                      </p>
                      <Button className="mt-4" asChild>
                        <a href="/dashboard">Explorar productos</a>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {purchases.map((purchase) => (
                        <div key={purchase.id} className="border rounded-lg overflow-hidden">
                          <div className="bg-muted p-4 flex justify-between items-center">
                            <div>
                              <p className="font-medium">{purchase.id}</p>
                              <p className="text-sm text-muted-foreground">{purchase.date}</p>
                            </div>
                            <div className="flex items-center gap-4">
                              {getStatusBadge(purchase.status)}
                              <p className="font-medium">ARS {purchase.total.toLocaleString("es-AR")}</p>
                            </div>
                          </div>
                          <div className="p-4 space-y-4">
                            {purchase.items.map((item) => (
                              <div key={item.id} className="flex items-center gap-4">
                                <div className="relative w-16 h-16 flex-shrink-0">
                                  <Image
                                    src={item.image || "/placeholder.svg"}
                                    alt={item.name}
                                    fill
                                    className="object-contain"
                                  />
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium">{item.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    ARS {item.price.toLocaleString("es-AR")}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="bg-muted p-4 flex justify-end">
                            <Button variant="outline" size="sm">
                              Ver detalles
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "payment" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Métodos de pago</CardTitle>
                  <CardDescription>
                    Administra tus métodos de pago para realizar compras en MagicMarket.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {paymentMethods.map((method) => (
                      <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          {method.type === "mercadopago" ? (
                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                              MP
                            </div>
                          ) : (
                            <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center text-white">
                              <CreditCard className="h-5 w-5" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium">{method.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {method.type === "mercadopago"
                                ? method.email
                                : `${method.bank} - ${method.accountNumber}`}
                            </p>
                            {method.isDefault && (
                              <Badge variant="outline" className="mt-1 text-xs">
                                Predeterminado
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {!method.isDefault && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSetDefaultPaymentMethod(method.id)}
                            >
                              Predeterminar
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDeletePaymentMethod(method.id)}
                          >
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6">
                    <Button className="w-full">Agregar método de pago</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "security" && (
            <Card>
              <CardHeader>
                <CardTitle>Seguridad</CardTitle>
                <CardDescription>
                  Actualiza tu contraseña y configura las opciones de seguridad de tu cuenta.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Contraseña actual</Label>
                      <Input id="currentPassword" name="currentPassword" type="password" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">Nueva contraseña</Label>
                      <Input id="newPassword" name="newPassword" type="password" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirmar nueva contraseña</Label>
                      <Input id="confirmPassword" name="confirmPassword" type="password" />
                    </div>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleSubmit}>Actualizar contraseña</Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

