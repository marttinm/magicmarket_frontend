"use client"

import type React from "react"

import { useState } from "react"
import { Bell, X, Pin, Clock, CheckCircle, Info, AlertTriangle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export type NotificationType = "info" | "warning" | "success" | "error"
export type NotificationPriority = "normal" | "high" | "critical"

export interface Notification {
  id: string
  title: string
  message: string
  type: NotificationType
  priority: NotificationPriority
  isPinned: boolean
  isRead: boolean
  createdAt: Date
  expiresAt: Date | null
}

// Mock data para notificaciones
const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "¡Bienvenido a MagicMarket!",
    message: "Gracias por unirte a nuestra plataforma. Explora nuestro marketplace para encontrar los mejores items.",
    type: "info",
    priority: "normal",
    isPinned: false,
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 horas atrás
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 días
  },
  {
    id: "2",
    title: "Mantenimiento programado",
    message: "El sistema estará en mantenimiento el 15 de marzo de 2023 de 2:00 AM a 4:00 AM (UTC-3).",
    type: "warning",
    priority: "high",
    isPinned: true,
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 día atrás
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3), // 3 días
  },
  {
    id: "3",
    title: "Compra exitosa",
    message: "Tu compra de 'AWP | Neo-Noir' ha sido procesada correctamente.",
    type: "success",
    priority: "normal",
    isPinned: false,
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 días atrás
    expiresAt: null, // No expira
  },
  {
    id: "4",
    title: "¡Oferta especial!",
    message: "Descuentos de hasta 30% en cuchillos este fin de semana. ¡No te lo pierdas!",
    type: "info",
    priority: "critical",
    isPinned: true,
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutos atrás
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2), // 2 días
  },
]

export function NotificationsDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [isOpen, setIsOpen] = useState(false)

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, isRead: true } : notification)),
    )
  }

  // Modificar la función handleRemove para evitar que se cierre el dropdown
  const handleRemove = (id: string, e: React.MouseEvent) => {
    // Evitar que el evento se propague y cierre el dropdown
    e.stopPropagation()

    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  // Ordenar notificaciones: primero las fijadas, luego por fecha (más recientes primero)
  const sortedNotifications = [...notifications].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    return b.createdAt.getTime() - a.createdAt.getTime()
  })

  // Modificar el estilo de los badges para unificar tamaños y usar iconos para diferenciar tipos
  // Reemplazar la función getNotificationTypeStyles con esta nueva implementación
  const getNotificationTypeStyles = (type: NotificationType) => {
    switch (type) {
      case "info":
        return "bg-blue-500/10 text-blue-500 border-blue-500/50"
      case "warning":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/50"
      case "success":
        return "bg-green-500/10 text-green-500 border-green-500/50"
      case "error":
        return "bg-red-500/10 text-red-500 border-red-500/50"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/50"
    }
  }

  // Agregar una función para obtener el icono según el tipo
  const getNotificationTypeIcon = (type: NotificationType) => {
    switch (type) {
      case "info":
        return <Info className="h-3 w-3" />
      case "warning":
        return <AlertTriangle className="h-3 w-3" />
      case "success":
        return <CheckCircle className="h-3 w-3" />
      case "error":
        return <AlertCircle className="h-3 w-3" />
      default:
        return <Info className="h-3 w-3" />
    }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return `${diffInSeconds}s`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`
    return `${Math.floor(diffInSeconds / 86400)}d`
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
          <span className="sr-only">Notificaciones</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel>Notificaciones</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-[400px] overflow-y-auto">
          <DropdownMenuGroup>
            {sortedNotifications.length > 0 ? (
              sortedNotifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className={cn("flex flex-col items-start p-3 cursor-default", !notification.isRead && "bg-muted/50")}
                >
                  <div className="flex justify-between items-start w-full">
                    <div className="flex items-start gap-2">
                      <div
                        className={cn(
                          "flex items-center justify-center p-1 rounded-full mt-0.5",
                          getNotificationTypeStyles(notification.type),
                        )}
                      >
                        {getNotificationTypeIcon(notification.type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <p className="font-medium text-sm">{notification.title}</p>
                          {notification.isPinned && <Pin className="h-3 w-3 text-primary" />}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <p className="text-xs text-muted-foreground flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatTimeAgo(notification.createdAt)}
                          </p>
                          {!notification.isRead && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-auto py-0.5 px-1.5 text-xs"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleMarkAsRead(notification.id)
                              }}
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Marcar como leída
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-1 text-muted-foreground hover:text-foreground"
                      onClick={(e) => handleRemove(notification.id, e)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </DropdownMenuItem>
              ))
            ) : (
              <div className="py-6 text-center">
                <p className="text-sm text-muted-foreground">No tienes notificaciones</p>
              </div>
            )}
          </DropdownMenuGroup>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

