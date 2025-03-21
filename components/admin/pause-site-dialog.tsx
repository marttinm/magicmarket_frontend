"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

type PauseSiteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  isPaused: boolean
  onConfirm: () => void
}

export function PauseSiteDialog({ open, onOpenChange, isPaused, onConfirm }: PauseSiteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            {isPaused ? "Reactivar sitio" : "Pausar sitio"}
          </DialogTitle>
          <DialogDescription>
            {isPaused
              ? "¿Estás seguro de que deseas reactivar el sitio? Esto permitirá que los usuarios realicen transacciones nuevamente."
              : "¿Estás seguro de que deseas pausar el sitio? Esto detendrá todas las transacciones."}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {isPaused ? (
            <p className="text-sm text-muted-foreground">
              Al reactivar el sitio, todas las funcionalidades volverán a estar disponibles para los usuarios.
            </p>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Al pausar el sitio, se detendrán inmediatamente:</p>
              <ul className="text-sm space-y-1 list-disc pl-5">
                <li>Todas las transacciones de compra y venta</li>
                <li>Registro de nuevos usuarios</li>
                <li>Sincronización automática de precios e items</li>
                <li>Procesamiento de pagos pendientes</li>
              </ul>
              <div className="bg-destructive/10 p-3 rounded-md text-destructive text-sm">
                <p className="font-medium">¡Atención!</p>
                <p>Esta es una medida de emergencia y debe usarse solo en situaciones críticas.</p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            variant={isPaused ? "default" : "destructive"}
            onClick={() => {
              onConfirm()
              onOpenChange(false)
            }}
          >
            {isPaused ? "Reactivar sitio" : "Pausar sitio"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

