/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Desactivar el modo estricto para evitar doble renderizado
  swcMinify: true,
  images: {
    domains: ["hebbkx1anhila5yf.public.blob.vercel-storage.com"],
  },
}

module.exports = nextConfig

