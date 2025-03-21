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
import { Beaker } from "lucide-react"

type TestingModeDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  isTestingMode: boolean
  onConfirm: () => void
}

export function TestingModeDialog({ open, onOpenChange, isTestingMode, onConfirm }: TestingModeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Beaker className="h-5 w-5 text-primary" />
            {isTestingMode ? "Desactivar modo testing" : "Activar modo testing"}
          </DialogTitle>
          <DialogDescription>
            {isTestingMode
              ? "¿Estás seguro de que deseas desactivar el modo testing? Esto deshabilitará la landing page para todos los usuarios."
              : "¿Estás seguro de que deseas activar el modo testing? Esto habilitará la landing page para todos los usuarios."}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {isTestingMode ? (
            <p className="text-sm text-muted-foreground">
              Al desactivar el modo testing, la landing page (página de inicio con login para alphaTester y admin) será
              deshabilitada y los usuarios serán redirigidos directamente a la página de Market.
            </p>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Al activar el modo testing:</p>
              <ul className="text-sm space-y-1 list-disc pl-5">
                <li>La landing page (página de inicio) será habilitada para todos los usuarios</li>
                <li>Los usuarios podrán acceder a la página de login para alphaTester y admin</li>
                <li>El flujo de navegación comenzará desde la página de inicio</li>
              </ul>
              <div className="bg-yellow-500/10 p-3 rounded-md text-yellow-500 text-sm">
                <p className="font-medium">Nota:</p>
                <p>
                  Este modo es ideal para pruebas de integración y verificación de nuevas características con la landing
                  page activa.
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={() => {
              onConfirm()
              onOpenChange(false)
            }}
          >
            {isTestingMode ? "Desactivar modo testing" : "Activar modo testing"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

