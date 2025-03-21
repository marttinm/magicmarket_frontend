"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { Building2, CreditCard, Trash2, Plus, Check, RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Spinner } from "@/components/ui/spinner"

export default function PaymentMethodsPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [showAddPaymentMethod, setShowAddPaymentMethod] = useState(false)
  const [paymentType, setPaymentType] = useState<"mercadopago" | "bank">("mercadopago")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSynchronizing, setIsSynchronizing] = useState(false)
  const [isSynchronized, setIsSynchronized] = useState(false)

  // Estado para los campos del formulario
  const [formData, setFormData] = useState({
    email: "",
    accountName: "",
    accountNumber: "",
    bank: "",
    cbu: "",
    alias: "",
  })

  // Datos de ejemplo para los métodos de pago
  const [paymentMethods, setPaymentMethods] = useState([
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
  ])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSynchronizeMercadoPago = () => {
    setIsSynchronizing(true)

    // Simular sincronización con MercadoPago
    setTimeout(() => {
      // Simular que se obtuvo el email de la cuenta de MercadoPago
      const mercadoPagoEmail = "usuario.sincronizado@mercadopago.com"

      // Actualizar el formulario con el email obtenido
      setFormData({
        ...formData,
        email: mercadoPagoEmail,
      })

      setIsSynchronizing(false)
      setIsSynchronized(true)

      toast({
        title: "Cuenta sincronizada",
        description: "Tu cuenta de MercadoPago ha sido sincronizada correctamente.",
      })
    }, 2000)
  }

  const handleAddPaymentMethod = () => {
    setIsSubmitting(true)

    // Simular envío de datos
    setTimeout(() => {
      // Crear nuevo método de pago
      const newMethod = {
        id: paymentMethods.length + 1,
        type: paymentType,
        name: paymentType === "mercadopago" ? "MercadoPago" : "Transferencia Bancaria",
        ...(paymentType === "mercadopago"
          ? { email: formData.email }
          : {
              accountNumber: "•••• •••• •••• " + formData.accountNumber.slice(-4),
              bank: formData.bank,
            }),
        isDefault: false,
      }

      // Agregar el nuevo método
      setPaymentMethods([...paymentMethods, newMethod])

      // Cerrar el diálogo y mostrar notificación
      setShowAddPaymentMethod(false)
      setIsSubmitting(false)
      setIsSynchronized(false)

      // Resetear el formulario
      setFormData({
        email: "",
        accountName: "",
        accountNumber: "",
        bank: "",
        cbu: "",
        alias: "",
      })

      toast({
        title: "Método de pago agregado",
        description: "Tu nuevo método de pago ha sido agregado correctamente.",
      })
    }, 1500)
  }

  const handleDeletePaymentMethod = (id: number) => {
    // Filtrar el método de pago a eliminar
    const updatedMethods = paymentMethods.filter((method) => method.id !== id)
    setPaymentMethods(updatedMethods)

    toast({
      title: "Método de pago eliminado",
      description: "El método de pago ha sido eliminado correctamente.",
    })
  }

  const handleSetDefaultPaymentMethod = (id: number) => {
    // Actualizar los métodos de pago para establecer el predeterminado
    const updatedMethods = paymentMethods.map((method) => ({
      ...method,
      isDefault: method.id === id,
    }))

    setPaymentMethods(updatedMethods)

    toast({
      title: "Método de pago actualizado",
      description: "El método de pago predeterminado ha sido actualizado.",
    })
  }

  const handlePaymentTypeChange = (value: "mercadopago" | "bank") => {
    setPaymentType(value)
    setIsSynchronized(false)
  }

  return (
    <div className="container py-10">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Métodos de pago</h1>
          <Button onClick={() => router.back()} variant="outline">
            Volver
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tus métodos de pago</CardTitle>
            <CardDescription>Administra tus métodos de pago para recibir dinero por tus ventas.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paymentMethods.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No tienes métodos de pago configurados.</p>
                </div>
              ) : (
                paymentMethods.map((method) => (
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
                          {method.type === "mercadopago" ? method.email : `${method.bank} - ${method.accountNumber}`}
                        </p>
                        {method.isDefault && (
                          <div className="flex items-center gap-1 mt-1 text-xs text-primary">
                            <Check className="h-3 w-3" />
                            <span>Predeterminado</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!method.isDefault && (
                        <Button variant="outline" size="sm" onClick={() => handleSetDefaultPaymentMethod(method.id)}>
                          Predeterminar
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDeletePaymentMethod(method.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
          <Separator />
          <CardFooter className="pt-6">
            <Button onClick={() => setShowAddPaymentMethod(true)} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Agregar método de pago
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Diálogo para agregar método de pago */}
      <Dialog open={showAddPaymentMethod} onOpenChange={setShowAddPaymentMethod}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Agregar método de pago</DialogTitle>
            <DialogDescription>Agrega un nuevo método de pago para recibir dinero por tus ventas.</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <RadioGroup value={paymentType} onValueChange={handlePaymentTypeChange} className="grid grid-cols-2 gap-4">
              <div
                className={`border rounded-lg p-4 cursor-pointer ${paymentType === "mercadopago" ? "ring-2 ring-primary" : ""}`}
              >
                <RadioGroupItem value="mercadopago" id="mercadopago" className="sr-only" />
                <Label htmlFor="mercadopago" className="flex flex-col items-center gap-2 cursor-pointer">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                    MP
                  </div>
                  <span>MercadoPago</span>
                </Label>
              </div>

              <div
                className={`border rounded-lg p-4 cursor-pointer ${paymentType === "bank" ? "ring-2 ring-primary" : ""}`}
              >
                <RadioGroupItem value="bank" id="bank" className="sr-only" />
                <Label htmlFor="bank" className="flex flex-col items-center gap-2 cursor-pointer">
                  <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center text-white">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <span>Banco</span>
                </Label>
              </div>
            </RadioGroup>

            {paymentType === "mercadopago" ? (
              <div className="space-y-4">
                {/* Botón de sincronización para MercadoPago */}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleSynchronizeMercadoPago}
                  disabled={isSynchronizing || isSynchronized}
                >
                  {isSynchronizing ? (
                    <>
                      <Spinner className="mr-2 h-4 w-4" />
                      Sincronizando...
                    </>
                  ) : isSynchronized ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Cuenta sincronizada
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Sincronizar cuenta
                    </>
                  )}
                </Button>

                <div className="space-y-2">
                  <Label htmlFor="email">Email de MercadoPago</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className={isSynchronized ? "bg-muted" : ""}
                    readOnly={isSynchronized}
                  />
                  {isSynchronized && (
                    <p className="text-xs text-muted-foreground">
                      Este email se ha obtenido automáticamente de tu cuenta de MercadoPago.
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="accountName">Titular de la cuenta</Label>
                  <Input
                    id="accountName"
                    name="accountName"
                    placeholder="Nombre y apellido"
                    value={formData.accountName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bank">Banco</Label>
                  <Input
                    id="bank"
                    name="bank"
                    placeholder="Nombre del banco"
                    value={formData.bank}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Número de cuenta</Label>
                  <Input
                    id="accountNumber"
                    name="accountNumber"
                    placeholder="Número de cuenta"
                    value={formData.accountNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cbu">CBU</Label>
                  <Input
                    id="cbu"
                    name="cbu"
                    placeholder="CBU"
                    value={formData.cbu}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alias">Alias</Label>
                  <Input
                    id="alias"
                    name="alias"
                    placeholder="Alias"
                    value={formData.alias}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddPaymentMethod(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleAddPaymentMethod}
              disabled={isSubmitting || (paymentType === "mercadopago" && !formData.email)}
            >
              {isSubmitting ? "Agregando..." : "Agregar método de pago"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

