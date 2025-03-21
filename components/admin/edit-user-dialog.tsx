"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, User, AlertTriangle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

type UserData = {
  id: string
  name: string
  email: string
  status: "active" | "suspended" | "pending"
  registrationDate: string
}

type EditUserDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: UserData | null
  onSave: (userData: UserData) => void
}

export function EditUserDialog({ open, onOpenChange, user, onSave }: EditUserDialogProps) {
  const [userData, setUserData] = useState<UserData | null>(user)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { toast } = useToast()

  // Agregar el estado para el diálogo de confirmación después de la declaración de los otros estados
  const [showConfirmation, setShowConfirmation] = useState(false)

  // Actualizar el estado cuando cambia el usuario
  if (user && (!userData || user.id !== userData.id)) {
    setUserData(user)
    setErrors({})
  }

  if (!userData) return null

  const handleChange = (field: keyof UserData, value: string) => {
    setUserData({ ...userData, [field]: value })

    // Limpiar error al cambiar el valor
    if (errors[field]) {
      const newErrors = { ...errors }
      delete newErrors[field]
      setErrors(newErrors)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!userData.name.trim()) {
      newErrors.name = "El nombre es requerido"
    }

    if (!userData.email.trim()) {
      newErrors.email = "El email es requerido"
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      newErrors.email = "Email inválido"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Modificar la función handleSubmit para mostrar la confirmación en lugar de guardar directamente
  const handleSubmit = () => {
    if (validateForm()) {
      setShowConfirmation(true)
    }
  }

  // Agregar una nueva función para confirmar el guardado
  const confirmSave = () => {
    onSave(userData)
    setShowConfirmation(false)
    onOpenChange(false)
    toast({
      title: "Usuario actualizado",
      description: "Los datos del usuario han sido actualizados correctamente.",
    })
  }

  // Modificar el return para incluir el diálogo de confirmación
  // Reemplazar todo el return por:
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Usuario</DialogTitle>
            <DialogDescription>
              Modifica los datos del usuario. Haz clic en guardar cuando hayas terminado.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">ID de Usuario</p>
                <p className="font-medium">{userData.id}</p>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="name">Nombre completo</Label>
              <Input
                id="name"
                value={userData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-destructive text-sm flex items-center mt-1">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.name}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={userData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="text-destructive text-sm flex items-center mt-1">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.email}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Estado</Label>
              <Select
                value={userData.status}
                onValueChange={(value: "active" | "suspended" | "pending") => handleChange("status", value)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">
                    <div className="flex items-center">
                      <Badge variant="outline" className="bg-green-500/20 text-green-500 border-green-500/50 mr-2">
                        Activo
                      </Badge>
                      <span>Activo</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="suspended">
                    <div className="flex items-center">
                      <Badge variant="outline" className="bg-red-500/20 text-red-500 border-red-500/50 mr-2">
                        Suspendido
                      </Badge>
                      <span>Suspendido</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="pending">
                    <div className="flex items-center">
                      <Badge variant="outline" className="bg-yellow-500/20 text-yellow-500 border-yellow-500/50 mr-2">
                        Pendiente
                      </Badge>
                      <span>Pendiente</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="registrationDate">Fecha de registro</Label>
              <Input id="registrationDate" value={userData.registrationDate} disabled className="bg-muted" />
              <p className="text-xs text-muted-foreground">La fecha de registro no puede ser modificada</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>Guardar cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmación */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-primary" />
              Confirmar cambios
            </DialogTitle>
            <DialogDescription>¿Estás seguro de que deseas guardar los cambios en este usuario?</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Esta acción actualizará los datos del usuario "{userData.name}" en el sistema.
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmation(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmSave}>Confirmar cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

