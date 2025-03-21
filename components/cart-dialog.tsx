"use client"
// this is a comment
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"
import { ShoppingCart, Trash2 } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

type CartDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CartDialog({ open, onOpenChange }: CartDialogProps) {
  const { cart, removeFromCart, cartTotalPrice } = useCart()
  const router = useRouter()

  const handleCheckout = () => {
    onOpenChange(false)
    router.push("/checkout")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] w-full">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Carrito de compras</h2>
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">No hay items en el carrito</div>
          ) : (
            <>
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 bg-muted/50 p-3 rounded-lg w-full">
                    <div className="relative w-16 h-16">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-contain" />
                    </div>
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <h3 className="font-medium text-sm truncate max-w-full">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">Cantidad: {item.quantity}</p>
                      <p className="text-sm">ARS {item.price.toLocaleString("es-AR")}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between font-medium">
                  <span>Total</span>
                  <span>ARS {cartTotalPrice.toLocaleString("es-AR")}</span>
                </div>

                <Button className="w-full" onClick={handleCheckout}>
                  Proceder al pago
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

