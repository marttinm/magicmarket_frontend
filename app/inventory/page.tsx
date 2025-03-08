import { Button } from "@/components/ui/button"
import { ComputerIcon as Steam } from "lucide-react"

export default function InventoryPage() {
  return (
    <div className="container py-12">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-2xl font-bold mb-4">Sincroniza tu inventario de Steam</h1>
        <p className="text-muted-foreground mb-8">
          Conecta tu cuenta de Steam para importar automáticamente tu inventario y empezar a comerciar.
        </p>
        <Button size="lg">
          <Steam className="mr-2 h-5 w-5" />
          Conectar con Steam
        </Button>
      </div>
    </div>
  )
}

