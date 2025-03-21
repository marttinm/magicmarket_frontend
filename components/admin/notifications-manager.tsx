"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Pin, Clock, Trash2, Edit, AlertTriangle, Info, CheckCircle, AlertCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import type { NotificationType, NotificationPriority, Notification } from "@/components/notifications-dropdown"
import { cn } from "@/lib/utils"

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

export function NotificationsManager() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [editingNotification, setEditingNotification] = useState<Notification | null>(null)
  const [newNotification, setNewNotification] = useState<Partial<Notification>>({
    title: "",
    message: "",
    type: "info",
    priority: "normal",
    isPinned: false,
    expiresAt: null,
  })
  const [expirationDays, setExpirationDays] = useState<string>("7")
  const { toast } = useToast()

  const handleCreateNotification = () => {
    if (!newNotification.title || !newNotification.message) {
      toast({
        title: "Error",
        description: "El título y el mensaje son obligatorios.",
        variant: "destructive",
      })
      return
    }

    const now = new Date()
    const expiresAt =
      expirationDays === "never"
        ? null
        : new Date(now.getTime() + Number.parseInt(expirationDays) * 24 * 60 * 60 * 1000)

    const notification: Notification = {
      id: Date.now().toString(),
      title: newNotification.title || "",
      message: newNotification.message || "",
      type: (newNotification.type as NotificationType) || "info",
      priority: (newNotification.priority as NotificationPriority) || "normal",
      isPinned: newNotification.isPinned || false,
      isRead: false,
      createdAt: now,
      expiresAt,
    }

    setNotifications([notification, ...notifications])
    setNewNotification({
      title: "",
      message: "",
      type: "info",
      priority: "normal",
      isPinned: false,
      expiresAt: null,
    })
    setExpirationDays("7")

    toast({
      title: "Notificación creada",
      description: "La notificación ha sido creada y enviada a los usuarios.",
    })
  }

  const handleUpdateNotification = () => {
    if (!editingNotification) return

    setNotifications((prev) =>
      prev.map((notification) => (notification.id === editingNotification.id ? editingNotification : notification)),
    )
    setEditingNotification(null)

    toast({
      title: "Notificación actualizada",
      description: "La notificación ha sido actualizada correctamente.",
    })
  }

  const handleDeleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))

    toast({
      title: "Notificación eliminada",
      description: "La notificación ha sido eliminada correctamente.",
    })
  }

  const handleEditNotification = (notification: Notification) => {
    setEditingNotification(notification)
  }

  const getNotificationTypeIcon = (type: NotificationType) => {
    switch (type) {
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  const getNotificationPriorityBadge = (priority: NotificationPriority) => {
    switch (priority) {
      case "normal":
        return (
          <Badge variant="outline" className="bg-blue-500/20 text-blue-500 border-blue-500/50">
            Normal
          </Badge>
        )
      case "high":
        return (
          <Badge variant="outline" className="bg-yellow-500/20 text-yellow-500 border-yellow-500/50">
            Alta
          </Badge>
        )
      case "critical":
        return (
          <Badge variant="outline" className="bg-red-500/20 text-red-500 border-red-500/50">
            Crítica
          </Badge>
        )
      default:
        return <Badge variant="outline">Normal</Badge>
    }
  }

  const formatDate = (date: Date | null) => {
    if (!date) return "No expira"
    return date.toLocaleString()
  }

  return (
    <Tabs defaultValue="create">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="create">Crear notificación</TabsTrigger>
        <TabsTrigger value="manage">Gestionar notificaciones</TabsTrigger>
      </TabsList>

      <TabsContent value="create" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Crear nueva notificación</CardTitle>
            <CardDescription>Crea una nueva notificación para enviar a todos los usuarios.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={newNotification.title}
                onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
                placeholder="Título de la notificación"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Mensaje</Label>
              <Textarea
                id="message"
                value={newNotification.message}
                onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
                placeholder="Mensaje de la notificación"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Tipo</Label>
                <Select
                  value={newNotification.type as string}
                  onValueChange={(value) => setNewNotification({ ...newNotification, type: value as NotificationType })}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">Información</SelectItem>
                    <SelectItem value="warning">Advertencia</SelectItem>
                    <SelectItem value="success">Éxito</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Prioridad</Label>
                <Select
                  value={newNotification.priority as string}
                  onValueChange={(value) =>
                    setNewNotification({ ...newNotification, priority: value as NotificationPriority })
                  }
                >
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Seleccionar prioridad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="critical">Crítica</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiration">Tiempo de expiración</Label>
              <Select value={expirationDays} onValueChange={setExpirationDays}>
                <SelectTrigger id="expiration">
                  <SelectValue placeholder="Seleccionar tiempo de expiración" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 día</SelectItem>
                  <SelectItem value="3">3 días</SelectItem>
                  <SelectItem value="7">7 días</SelectItem>
                  <SelectItem value="14">14 días</SelectItem>
                  <SelectItem value="30">30 días</SelectItem>
                  <SelectItem value="never">No expira</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="pinned"
                checked={newNotification.isPinned}
                onCheckedChange={(checked) => setNewNotification({ ...newNotification, isPinned: checked })}
              />
              <Label htmlFor="pinned">Fijar notificación (aparecerá primero para todos los usuarios)</Label>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleCreateNotification} className="w-full">
              Crear y enviar notificación
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="manage" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Gestionar notificaciones</CardTitle>
            <CardDescription>Administra las notificaciones existentes.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notifications.length === 0 ? (
                <div className="text-center py-6">
                  <Bell className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No hay notificaciones</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Crea una nueva notificación para enviar a los usuarios.
                  </p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div key={notification.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            "flex items-center justify-center p-1 rounded-full",
                            notification.type === "info"
                              ? "bg-blue-500/10 text-blue-500"
                              : notification.type === "warning"
                                ? "bg-yellow-500/10 text-yellow-500"
                                : notification.type === "success"
                                  ? "bg-green-500/10 text-green-500"
                                  : "bg-red-500/10 text-red-500",
                          )}
                        >
                          {getNotificationTypeIcon(notification.type)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{notification.title}</h3>
                            {notification.isPinned && <Pin className="h-4 w-4 text-primary" />}
                            {getNotificationPriorityBadge(notification.priority)}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              Creada: {notification.createdAt.toLocaleString()}
                            </span>
                            <span>Expira: {formatDate(notification.expiresAt)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 px-2"
                          onClick={() => handleEditNotification(notification)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 px-2 text-destructive hover:text-destructive"
                          onClick={() => handleDeleteNotification(notification.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {editingNotification && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <CardTitle>Editar notificación</CardTitle>
              <CardDescription>Modifica los detalles de la notificación.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Título</Label>
                <Input
                  id="edit-title"
                  value={editingNotification.title}
                  onChange={(e) => setEditingNotification({ ...editingNotification, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-message">Mensaje</Label>
                <Textarea
                  id="edit-message"
                  value={editingNotification.message}
                  onChange={(e) => setEditingNotification({ ...editingNotification, message: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-type">Tipo</Label>
                  <Select
                    value={editingNotification.type}
                    onValueChange={(value) =>
                      setEditingNotification({ ...editingNotification, type: value as NotificationType })
                    }
                  >
                    <SelectTrigger id="edit-type">
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="info">Información</SelectItem>
                      <SelectItem value="warning">Advertencia</SelectItem>
                      <SelectItem value="success">Éxito</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-priority">Prioridad</Label>
                  <Select
                    value={editingNotification.priority}
                    onValueChange={(value) =>
                      setEditingNotification({ ...editingNotification, priority: value as NotificationPriority })
                    }
                  >
                    <SelectTrigger id="edit-priority">
                      <SelectValue placeholder="Seleccionar prioridad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                      <SelectItem value="critical">Crítica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-pinned"
                  checked={editingNotification.isPinned}
                  onCheckedChange={(checked) => setEditingNotification({ ...editingNotification, isPinned: checked })}
                />
                <Label htmlFor="edit-pinned">Fijar notificación (aparecerá primero para todos los usuarios)</Label>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setEditingNotification(null)}>
                Cancelar
              </Button>
              <Button onClick={handleUpdateNotification}>Guardar cambios</Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </Tabs>
  )
}

