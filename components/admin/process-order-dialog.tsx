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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

type ProcessOrderDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  order: any
  onStatusChange: (orderId: string, newStatus: string, feedback?: string) => void
}

export function ProcessOrderDialog({ open, onOpenChange, order, onStatusChange }: ProcessOrderDialogProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>("")
  const [feedback, setFeedback] = useState("")
  const [showError, setShowError] = useState(false)

  const handleSubmit = () => {
    if (!selectedStatus) {
      setShowError(true)
      return
    }

    onStatusChange(order.id, selectedStatus, feedback)
    onOpenChange(false)

    // Reset state
    setSelectedStatus("")
    setFeedback("")
    setShowError(false)
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Reset state when dialog closes
      setSelectedStatus("")
      setFeedback("")
      setShowError(false)
    }
    onOpenChange(open)
  }

  if (!order) return null

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Procesar Pedido {order.id}</DialogTitle>
          <DialogDescription>Actualiza el estado del pedido y proporciona retroalimentación.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Estado actual</Label>
            <Badge
              variant="outline"
              className={
                order.status === "completed"
                  ? "bg-green-500/20 text-green-500 border-green-500/50"
                  : order.status === "pending"
                    ? "bg-yellow-500/20 text-yellow-500 border-yellow-500/50"
                    : order.status === "processing"
                      ? "bg-blue-500/20 text-blue-500 border-blue-500/50"
                      : "bg-red-500/20 text-red-500 border-red-500/50"
              }
            >
              {order.status === "completed"
                ? "Completado"
                : order.status === "pending"
                  ? "Pendiente"
                  : order.status === "processing"
                    ? "En proceso"
                    : "Cancelado"}
            </Badge>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Nuevo estado</Label>
            <RadioGroup
              value={selectedStatus}
              onValueChange={(value) => {
                setSelectedStatus(value)
                setShowError(false)
              }}
              className="flex flex-col space-y-1"
            >
              {order.status !== "completed" && (
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="completed" id="completed" />
                  <Label htmlFor="completed" className="cursor-pointer">
                    Completado
                  </Label>
                </div>
              )}
              {order.status !== "processing" && order.status !== "completed" && (
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="processing" id="processing" />
                  <Label htmlFor="processing" className="cursor-pointer">
                    En proceso
                  </Label>
                </div>
              )}
              {order.status !== "cancelled" && (
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cancelled" id="cancelled" />
                  <Label htmlFor="cancelled" className="cursor-pointer">
                    Cancelado
                  </Label>
                </div>
              )}
            </RadioGroup>

            {showError && (
              <Alert variant="destructive" className="mt-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Debes seleccionar un nuevo estado para el pedido.</AlertDescription>
              </Alert>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedback">Comentarios (opcional)</Label>
            <Textarea
              id="feedback"
              placeholder="Añade comentarios o instrucciones adicionales..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={!selectedStatus}>
            Actualizar pedido
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

