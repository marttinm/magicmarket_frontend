"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { SteamLogo } from "@/components/steam-logo"

export function SteamLoginDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [isAdult, setIsAdult] = useState(false)
  const { login } = useAuth()

  const handleSteamLogin = async () => {
    if (!acceptedTerms || !isAdult) return

    setIsOpen(false)
    login()
  }

  return (
    <>
      <Button variant="outline" className="gap-2" onClick={() => setIsOpen(true)}>
        <SteamLogo width={20} height={20} inverted={true} />
        Iniciar sesión con Steam
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md bg-background border-primary">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">INICIO DE SESIÓN</h2>

            <p className="text-center text-sm text-muted-foreground">
              Acepta los términos y haz clic en el botón de abajo para iniciar sesión a través de Steam.
            </p>

            <div className="space-y-4">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={acceptedTerms}
                  onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="terms" className="text-sm">
                    Acepto los{" "}
                    <a href="#" className="text-primary hover:underline">
                      Condiciones del servicio
                    </a>
                    , la{" "}
                    <a href="#" className="text-primary hover:underline">
                      Política de privacidad
                    </a>{" "}
                    y el{" "}
                    <a href="#" className="text-primary hover:underline">
                      Acuerdo del titular de la tarjeta
                    </a>
                  </Label>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox id="adult" checked={isAdult} onCheckedChange={(checked) => setIsAdult(checked as boolean)} />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="adult" className="text-sm">
                    Tengo al menos 18 años
                  </Label>
                </div>
              </div>
            </div>

            <Button
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6"
              onClick={handleSteamLogin}
              disabled={!acceptedTerms || !isAdult}
            >
              <SteamLogo width={24} height={24} className="mr-2" inverted={false} />
              STEAM
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

