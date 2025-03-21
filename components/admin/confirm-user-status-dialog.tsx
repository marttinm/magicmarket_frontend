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
import { AlertTriangle, CheckCircle } from "lucide-react"

type ConfirmUserStatusDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: { id: string; name: string; status: string } | null
  onConfirm: () => void
}

export function ConfirmUserStatusDialog({ open, onOpenChange, user, onConfirm }: ConfirmUserStatusDialogProps) {
  if (!user) return null

  const isActivating = user.status !== "active"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isActivating ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-destructive" />
            )}
            {isActivating ? "Activar usuario" : "Suspender usuario"}
          </DialogTitle>
          <DialogDescription>
            {isActivating
              ? `¿Estás seguro de que deseas activar la cuenta de ${user.name}?`
              : `¿Estás seguro de que deseas suspender la cuenta de ${user.name}?`}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            {isActivating
              ? "Al activar esta cuenta, el usuario podrá acceder nuevamente a la plataforma y realizar operaciones."
              : "Al suspender esta cuenta, el usuario no podrá acceder a la plataforma ni realizar operaciones hasta que sea reactivado."}
          </p>

          {!isActivating && (
            <div className="mt-4 p-3 bg-destructive/10 rounded-md text-destructive text-sm">
              <p>Esta acción puede afectar a las operaciones en curso del usuario.</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            variant={isActivating ? "default" : "destructive"}
            onClick={() => {
              onConfirm()
              onOpenChange(false)
            }}
          >
            {isActivating ? "Activar usuario" : "Suspender usuario"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

