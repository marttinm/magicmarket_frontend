import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"

// Datos de ejemplo para los posts
const posts = [
  {
    id: 1,
    content:
      "¡Nueva colección de cuchillos disponible! Descubre los nuevos diseños exclusivos en MagicMarket 🔪✨ #CS2 #Skins #Gaming",
    date: "2h",
    likes: 45,
    reposts: 12,
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 2,
    content:
      "¿Buscas las mejores ofertas en skins de AWP? Tenemos descuentos de hasta 30% este fin de semana. ¡No te lo pierdas! 🎯 #AWP #Ofertas #CS2",
    date: "1d",
    likes: 87,
    reposts: 34,
  },
  {
    id: 3,
    content:
      "Felicitamos al ganador del sorteo mensual: @GamerPro123 ¡Disfruta tu nuevo AK-47 | Vulcan! 🎉 Próximo sorteo en 2 semanas. #Sorteo #CS2 #MagicMarket",
    date: "2d",
    likes: 124,
    reposts: 56,
    image: "/placeholder.svg?height=200&width=200",
  },
]

export default function XFeed() {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <X className="h-5 w-5" />
          <h2 className="text-2xl font-bold">Últimos posts</h2>
        </div>
        <Link
          href="https://x.com/magicmarket"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary hover:underline"
        >
          @magicmarket
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {posts.map((post) => (
          <Card key={post.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LogoMagicianColor.jpg-ufakYyKUriJzSS99ETTps17ukAr2Lj.jpeg"
                    alt="MagicMarket Logo"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-bold text-sm">MagicMarket</p>
                  <p className="text-xs text-muted-foreground">@magicmarket</p>
                </div>
                <div className="ml-auto text-xs text-muted-foreground">{post.date}</div>
              </div>

              <p className="text-sm mb-3">{post.content}</p>

              {post.image && (
                <div className="relative w-full h-40 rounded-lg overflow-hidden mb-3">
                  <Image src={post.image || "/placeholder.svg"} alt="Post image" fill className="object-cover" />
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                  <span>{post.likes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17 1l4 4-4 4"></path>
                    <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
                    <path d="M7 23l-4-4 4-4"></path>
                    <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
                  </svg>
                  <span>{post.reposts}</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                  <span>Comentar</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center mt-6">
        <Button variant="outline" className="gap-2">
          <X className="h-4 w-4" />
          Seguir en X
        </Button>
      </div>
    </div>
  )
}

