import { BookOpen, Video, FileText, ExternalLink } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

const guides = [
  {
    id: 1,
    title: "Guía completa de patrones de cuchillos",
    description: "Aprende a identificar los diferentes patrones de cuchillos y cómo afectan su valor en el mercado.",
    image: "/placeholder.svg?height=200&width=350",
    type: "article",
    readTime: "8 min",
    link: "/guides/knife-patterns",
  },
  {
    id: 2,
    title: "Cómo verificar el float de tus skins",
    description: "Tutorial paso a paso para verificar el float exacto de tus skins y entender su impacto en el precio.",
    image: "/placeholder.svg?height=200&width=350",
    type: "video",
    readTime: "5 min",
    link: "/guides/float-verification",
  },
  {
    id: 3,
    title: "Inversión en skins: Guía para principiantes",
    description: "Todo lo que necesitas saber para comenzar a invertir en skins de CS2 de manera inteligente.",
    image: "/placeholder.svg?height=200&width=350",
    type: "article",
    readTime: "12 min",
    link: "/guides/investment-basics",
  },
]

export default function GuidesSection() {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold">Guías y tutoriales</h2>
        </div>
        <Link href="/guides" className="text-sm text-primary hover:underline">
          Ver todas las guías
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {guides.map((guide) => (
          <Card key={guide.id} className="overflow-hidden flex flex-col">
            <div className="relative h-48 w-full">
              <Image src={guide.image || "/placeholder.svg"} alt={guide.title} fill className="object-cover" />
              <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm text-xs px-2 py-1 rounded-full flex items-center">
                {guide.type === "video" ? (
                  <>
                    <Video className="h-3 w-3 mr-1" />
                    Video
                  </>
                ) : (
                  <>
                    <FileText className="h-3 w-3 mr-1" />
                    Artículo
                  </>
                )}
              </div>
            </div>

            <CardContent className="flex-1 p-4">
              <h3 className="font-bold mb-2">{guide.title}</h3>
              <p className="text-sm text-muted-foreground mb-2">{guide.description}</p>
              <p className="text-xs text-muted-foreground">Tiempo de lectura: {guide.readTime}</p>
            </CardContent>

            <CardFooter className="p-4 pt-0">
              <Button variant="outline" className="w-full" asChild>
                <Link href={guide.link}>
                  <span className="flex items-center">
                    Leer guía
                    <ExternalLink className="h-3 w-3 ml-2" />
                  </span>
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

