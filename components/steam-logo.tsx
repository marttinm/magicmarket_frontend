import Image from "next/image"

type SteamLogoProps = {
  width: number
  height: number
  className?: string
  inverted?: boolean
}

export function SteamLogo({ width, height, className = "", inverted = false }: SteamLogoProps) {
  return (
    <Image
      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/icons8-steam-50%20%281%29-CXaM0ecmYb5km6PAaui00tqYKdK152.png"
      alt="Steam Logo"
      width={width}
      height={height}
      className={`${inverted ? "invert" : ""} ${className}`}
    />
  )
}

