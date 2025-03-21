"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ShieldAlert } from "lucide-react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

type SteamInventoryWarningDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SteamInventoryWarningDialog({ open, onOpenChange }: SteamInventoryWarningDialogProps) {
  const router = useRouter()

  const handleGoToProfile = () => {
    onOpenChange(false)
    router.push("/profile")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader className="text-center">
          <div className="mx-auto bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
            <ShieldAlert className="h-8 w-8 text-primary" />
          </div>
          <DialogTitle className="text-xl">Tu inventario de Steam está en privado</DialogTitle>
          <DialogDescription className="text-center">
            Mientras tu perfil de Steam y tu inventario sean privados, nadie podrá ver tus objetos ni enviarte una
            oferta de intercambio.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Card className="bg-muted/50 p-4">
            <div className="space-y-4">
              <p className="text-sm text-center">
                Para acceder al Mercado, necesitas cambiar la configuración de privacidad de tu inventario a{" "}
                <span className="font-bold">Público</span>.
              </p>

              <div className="bg-background p-3 rounded-md border">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Inventario:</span>
                  <span className="text-destructive font-medium">Privado</span>
                </div>
                <Separator className="my-2" />
                <div className="text-xs text-muted-foreground">
                  Opciones de privacidad:
                  <ul className="mt-1 space-y-1">
                    <li className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-green-500"></span>
                      <span>Público (recomendado)</span>
                    </li>
                    <li className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                      <span>Solo amigos</span>
                    </li>
                    <li className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-red-500"></span>
                      <span>Privado (actual)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>

          <div className="flex justify-center">
            <Button className="w-full" onClick={handleGoToProfile}>
              Ir a Mi Perfil
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

