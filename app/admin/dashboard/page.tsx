"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useThemeContext } from "@/components/theme-context"
import { useToast } from "@/components/ui/use-toast"
import {
  Moon,
  Palette,
  Users,
  ShoppingCart,
  Settings,
  LogOut,
  BarChart3,
  Check,
  User,
  Search,
  Calendar,
  DollarSign,
  Filter,
  Tag,
  PauseCircle,
  PlayCircle,
  Edit,
  RefreshCw,
  Eye,
  History,
  Package,
  AlertTriangle,
  Beaker,
  Bell,
} from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import Image from "next/image"
import { EditUserDialog } from "@/components/admin/edit-user-dialog"
import { ConfirmUserStatusDialog } from "@/components/admin/confirm-user-status-dialog"
import { ProcessOrderDialog } from "@/components/admin/process-order-dialog"
import { ConfirmProductStatusDialog } from "@/components/admin/confirm-product-status-dialog"
import { ConfirmSyncProductDialog } from "@/components/admin/confirm-sync-product-dialog"
import { EditProductDialog } from "@/components/admin/edit-product-dialog"
import { ConfirmSyncAllDialog } from "@/components/admin/confirm-sync-all-dialog"
import { SyncLog } from "@/components/admin/sync-log"
import { ConfirmSyncConfigDialog } from "@/components/admin/confirm-sync-config-dialog"
import { PauseSiteDialog } from "@/components/admin/pause-site-dialog"
import { TestingModeDialog } from "@/components/admin/testing-mode-dialog"
// Primero, importamos el componente de gestión de notificaciones
import { NotificationsManager } from "@/components/admin/notifications-manager"

export default function AdminDashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { theme, setTheme } = useThemeContext()
  const { toast } = useToast()

  // Estado para sincronización de precios
  const [syncStatus, setSyncStatus] = useState({
    isRunning: false,
    progress: 0,
    currentStep: "",
    lastSync: "",
    logs: [] as { time: string; message: string; type: "info" | "error" | "success" | "warning" }[],
  })

  // Estado para sincronización de items
  const [itemSyncStatus, setItemSyncStatus] = useState({
    isRunning: false,
    progress: 0,
    currentStep: "",
    lastSync: "",
    logs: [] as { time: string; message: string; type: "info" | "error" | "success" | "warning" }[],
  })

  // Configuración de sincronización
  const [syncConfig, setSyncConfig] = useState({
    priceInterval: "24", // horas
    itemInterval: "24", // horas
    autoSync: true,
    syncOnStartup: false,
  })

  // Estado para diálogos
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [userPurchasesOpen, setUserPurchasesOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)

  // Nuevos estados para los diálogos
  const [editUserDialogOpen, setEditUserDialogOpen] = useState(false)
  const [userToEdit, setUserToEdit] = useState<any>(null)
  const [confirmUserStatusDialogOpen, setConfirmUserStatusDialogOpen] = useState(false)
  const [userToChangeStatus, setUserToChangeStatus] = useState<any>(null)
  const [processOrderDialogOpen, setProcessOrderDialogOpen] = useState(false)
  const [orderToProcess, setOrderToProcess] = useState<any>(null)
  const [confirmProductStatusDialogOpen, setConfirmProductStatusDialogOpen] = useState(false)
  const [productToChangeStatus, setProductToChangeStatus] = useState<any>(null)
  const [confirmSyncProductDialogOpen, setConfirmSyncProductDialogOpen] = useState(false)
  const [productToSync, setProductToSync] = useState<any>(null)
  const [editProductDialogOpen, setEditProductDialogOpen] = useState(false)
  const [productToEdit, setProductToEdit] = useState<any>(null)
  const [confirmSyncAllDialogOpen, setConfirmSyncAllDialogOpen] = useState(false)
  const [syncType, setSyncType] = useState<"prices" | "items">("prices")

  const [confirmSyncConfigOpen, setConfirmSyncConfigOpen] = useState(false)
  const [syncConfigAction, setSyncConfigAction] = useState<{
    type: "autoSync" | "syncOnStartup"
    value: boolean
  } | null>(null)
  const [pauseSiteDialogOpen, setPauseSiteDialogOpen] = useState(false)
  const [sitePaused, setSitePaused] = useState(false)
  const [syncConfigTitle, setSyncConfigTitle] = useState("")
  const [syncConfigDescription, setSyncConfigDescription] = useState("")

  // Añadir el nuevo estado para el modo testing y su diálogo
  const [testingModeDialogOpen, setTestingModeDialogOpen] = useState(false)
  const [isTestingMode, setIsTestingMode] = useState(false)

  // Datos de ejemplo para las compras de un usuario
  const userPurchases = [
    {
      id: "#ORD-2023-001",
      date: "15/03/2023",
      items: [
        {
          id: 1,
          name: "AWP | Neo-Noir",
          price: 125000,
          image: "/placeholder.svg?height=60&width=60",
        },
      ],
      status: "completed",
      total: 125000,
      paymentMethod: "MercadoPago",
    },
    {
      id: "#ORD-2023-008",
      date: "22/04/2023",
      items: [
        {
          id: 2,
          name: "AK-47 | Vulcan",
          price: 87500,
          image: "/placeholder.svg?height=60&width=60",
        },
      ],
      status: "completed",
      total: 87500,
      paymentMethod: "Transferencia bancaria",
    },
  ]

  // Datos de ejemplo para productos
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "AWP | Neo-Noir",
      price: 125000,
      image: "/placeholder.svg?height=60&width=60",
      status: "active",
      stock: 5,
      category: "AWP",
      lastUpdated: "15/03/2023",
      float: 0.081651553535,
      pattern: 110,
      quality: "De tipo clasificado",
      description: "AWP con skin Neo-Noir en excelente estado",
    },
    {
      id: 2,
      name: "AK-47 | Vulcan",
      price: 87500,
      image: "/placeholder.svg?height=60&width=60",
      status: "active",
      stock: 3,
      category: "Rifle",
      lastUpdated: "22/04/2023",
      float: 0.0345678912,
      pattern: 223,
      quality: "De tipo clasificado",
      description: "AK-47 con skin Vulcan, perfecta para coleccionistas",
    },
    {
      id: 3,
      name: "USP-S | Kill Confirmed",
      price: 45000,
      image: "/placeholder.svg?height=60&width=60",
      status: "active",
      stock: 8,
      category: "Pistola",
      lastUpdated: "10/05/2023",
      float: 0.123456789,
      pattern: 432,
      quality: "De tipo clasificado",
      description: "USP-S con skin Kill Confirmed, muy buscada",
    },
    {
      id: 4,
      name: "Butterfly Knife | Fade",
      price: 750000,
      image: "/placeholder.svg?height=60&width=60",
      status: "paused",
      stock: 1,
      category: "Cuchillo",
      lastUpdated: "05/06/2023",
      float: 0.0098765432,
      pattern: 876,
      quality: "★ De aspecto extraordinario",
      description: "Butterfly Knife con skin Fade, extremadamente raro",
    },
    {
      id: 5,
      name: "Glock-18 | Fade",
      price: 35000,
      image: "/placeholder.svg?height=60&width=60",
      status: "active",
      stock: 6,
      category: "Pistola",
      lastUpdated: "18/07/2023",
      float: 0.0123456789,
      pattern: 345,
      quality: "De tipo clasificado",
      description: "Glock-18 con skin Fade, muy popular",
    },
  ])

  // Datos de ejemplo para usuarios
  const [users, setUsers] = useState([
    {
      id: "#1001",
      name: "Juan Pérez",
      email: "juan.perez@example.com",
      registrationDate: "15/03/2023",
      status: "active",
    },
    {
      id: "#1002",
      name: "María González",
      email: "maria.gonzalez@example.com",
      registrationDate: "22/04/2023",
      status: "active",
    },
    {
      id: "#1003",
      name: "Carlos Rodríguez",
      email: "carlos.rodriguez@example.com",
      registrationDate: "10/05/2023",
      status: "suspended",
    },
    {
      id: "#1004",
      name: "Ana Martínez",
      email: "ana.martinez@example.com",
      registrationDate: "05/06/2023",
      status: "active",
    },
    {
      id: "#1005",
      name: "Luis Sánchez",
      email: "luis.sanchez@example.com",
      registrationDate: "18/07/2023",
      status: "pending",
    },
  ])

  // Datos de ejemplo para pedidos
  const [orders, setOrders] = useState([
    {
      id: "#ORD-2023-001",
      customer: "Juan Pérez",
      date: "15/03/2023",
      total: 125000,
      paymentMethod: "MercadoPago",
      status: "completed",
      items: [
        {
          id: 1,
          name: "AWP | Neo-Noir",
          price: 125000,
          image: "/placeholder.svg?height=60&width=60",
          float: 0.081651553535,
          pattern: 110,
          quality: "De tipo clasificado",
        },
      ],
    },
    {
      id: "#ORD-2023-002",
      customer: "María González",
      date: "22/04/2023",
      total: 132500,
      paymentMethod: "MercadoPago",
      status: "completed",
      items: [
        {
          id: 2,
          name: "AK-47 | Vulcan",
          price: 87500,
          image: "/placeholder.svg?height=60&width=60",
          float: 0.0345678912,
          pattern: 223,
          quality: "De tipo clasificado",
        },
        {
          id: 3,
          name: "USP-S | Kill Confirmed",
          price: 45000,
          image: "/placeholder.svg?height=60&width=60",
          float: 0.123456789,
          pattern: 432,
          quality: "De tipo clasificado",
        },
      ],
    },
    {
      id: "#ORD-2023-003",
      customer: "Carlos Rodríguez",
      date: "10/05/2023",
      total: 750000,
      paymentMethod: "Transferencia bancaria",
      status: "pending",
      items: [
        {
          id: 4,
          name: "Butterfly Knife | Fade",
          price: 750000,
          image: "/placeholder.svg?height=60&width=60",
          float: 0.0098765432,
          pattern: 876,
          quality: "★ De aspecto extraordinario",
        },
      ],
    },
    {
      id: "#ORD-2023-004",
      customer: "Ana Martínez",
      date: "05/06/2023",
      total: 95000,
      paymentMethod: "MercadoPago",
      status: "processing",
      items: [
        {
          id: 5,
          name: "Glock-18 | Fade",
          price: 95000,
          image: "/placeholder.svg?height=60&width=60",
          float: 0.0123456789,
          pattern: 345,
          quality: "De tipo clasificado",
        },
      ],
    },
    {
      id: "#ORD-2023-005",
      customer: "Luis Sánchez",
      date: "18/07/2023",
      total: 320000,
      paymentMethod: "Transferencia bancaria",
      status: "cancelled",
      items: [
        {
          id: 6,
          name: "M4A4 | Howl",
          price: 320000,
          image: "/placeholder.svg?height=60&width=60",
          float: 0.0345678912,
          pattern: 567,
          quality: "De contrabando",
        },
      ],
    },
  ])

  // Manejador para la sincronización de todos los productos
  const handleSyncAllProducts = () => {
    setSyncType("prices")
    setConfirmSyncAllDialogOpen(true)
  }

  // Manejador para la sincronización de todos los items
  const handleSyncAllItems = () => {
    setSyncType("items")
    setConfirmSyncAllDialogOpen(true)
  }

  const handleSyncPrices = () => {
    // Reset sync status
    setSyncStatus({
      isRunning: true,
      progress: 0,
      currentStep: "Iniciando sincronización...",
      lastSync: "",
      logs: [
        { time: new Date().toLocaleTimeString(), message: "Iniciando sincronización de precios...", type: "info" },
      ],
    })

    // Simulate the synchronization process
    setTimeout(() => {
      setSyncStatus((prev) => ({
        ...prev,
        progress: 10,
        currentStep: "Conectando con API externa...",
        logs: [
          ...prev.logs,
          { time: new Date().toLocaleTimeString(), message: "Conectando con API externa...", type: "info" },
        ],
      }))

      setTimeout(() => {
        setSyncStatus((prev) => ({
          ...prev,
          progress: 25,
          currentStep: "Obteniendo datos de precios...",
          logs: [
            ...prev.logs,
            {
              time: new Date().toLocaleTimeString(),
              message: "Conexión establecida. Obteniendo datos de precios...",
              type: "info",
            },
          ],
        }))

        setTimeout(() => {
          setSyncStatus((prev) => ({
            ...prev,
            progress: 40,
            currentStep: "Procesando datos...",
            logs: [
              ...prev.logs,
              {
                time: new Date().toLocaleTimeString(),
                message: "Datos recibidos. Procesando información...",
                type: "info",
              },
            ],
          }))

          setTimeout(() => {
            setSyncStatus((prev) => ({
              ...prev,
              progress: 60,
              currentStep: "Actualizando base de datos...",
              logs: [
                ...prev.logs,
                {
                  time: new Date().toLocaleTimeString(),
                  message: "Actualizando precios en la base de datos...",
                  type: "info",
                },
              ],
            }))

            setTimeout(() => {
              setSyncStatus((prev) => ({
                ...prev,
                progress: 75,
                currentStep: "Verificando cambios...",
                logs: [
                  ...prev.logs,
                  {
                    time: new Date().toLocaleTimeString(),
                    message: "Precios actualizados. Verificando cambios...",
                    type: "info",
                  },
                  {
                    time: new Date().toLocaleTimeString(),
                    message: "Se encontraron 243 productos con cambios de precio.",
                    type: "info",
                  },
                ],
              }))

              setTimeout(() => {
                setSyncStatus((prev) => ({
                  ...prev,
                  progress: 90,
                  currentStep: "Aplicando cambios...",
                  logs: [
                    ...prev.logs,
                    {
                      time: new Date().toLocaleTimeString(),
                      message: "Aplicando cambios en el sistema...",
                      type: "info",
                    },
                  ],
                }))

                setTimeout(() => {
                  const now = new Date().toLocaleString()
                  setSyncStatus((prev) => ({
                    ...prev,
                    isRunning: false,
                    progress: 100,
                    currentStep: "Sincronización completada",
                    lastSync: now,
                    logs: [
                      ...prev.logs,
                      {
                        time: new Date().toLocaleTimeString(),
                        message: "¡Sincronización completada con éxito!",
                        type: "success",
                      },
                    ],
                  }))

                  toast({
                    title: "Sincronización completada",
                    description: "Los precios han sido actualizados correctamente.",
                  })
                }, 1000)
              }, 1000)
            }, 1000)
          }, 1500)
        }, 2000)
      }, 1500)
    }, 1000)
  }

  const handleSyncItems = () => {
    // Reset sync status
    setItemSyncStatus({
      isRunning: true,
      progress: 0,
      currentStep: "Iniciando sincronización...",
      lastSync: "",
      logs: [{ time: new Date().toLocaleTimeString(), message: "Iniciando sincronización de items...", type: "info" }],
    })

    // Simulate the synchronization process
    setTimeout(() => {
      setItemSyncStatus((prev) => ({
        ...prev,
        progress: 10,
        currentStep: "Conectando con API externa...",
        logs: [
          ...prev.logs,
          { time: new Date().toLocaleTimeString(), message: "Conectando con API externa...", type: "info" },
        ],
      }))

      setTimeout(() => {
        setItemSyncStatus((prev) => ({
          ...prev,
          progress: 20,
          currentStep: "Obteniendo lista de items...",
          logs: [
            ...prev.logs,
            {
              time: new Date().toLocaleTimeString(),
              message: "Conexión establecida. Obteniendo lista de items...",
              type: "info",
            },
          ],
        }))

        setTimeout(() => {
          setItemSyncStatus((prev) => ({
            ...prev,
            progress: 30,
            currentStep: "Descargando datos de items...",
            logs: [
              ...prev.logs,
              {
                time: new Date().toLocaleTimeString(),
                message: "Lista recibida. Descargando datos de 1,245 items...",
                type: "info",
              },
            ],
          }))

          setTimeout(() => {
            setItemSyncStatus((prev) => ({
              ...prev,
              progress: 45,
              currentStep: "Procesando imágenes...",
              logs: [
                ...prev.logs,
                {
                  time: new Date().toLocaleTimeString(),
                  message: "Datos recibidos. Procesando imágenes y metadatos...",
                  type: "info",
                },
              ],
            }))

            setTimeout(() => {
              setItemSyncStatus((prev) => ({
                ...prev,
                progress: 60,
                currentStep: "Actualizando base de datos...",
                logs: [
                  ...prev.logs,
                  {
                    time: new Date().toLocaleTimeString(),
                    message: "Actualizando items en la base de datos...",
                    type: "info",
                  },
                ],
              }))

              setTimeout(() => {
                setItemSyncStatus((prev) => ({
                  ...prev,
                  progress: 75,
                  currentStep: "Verificando cambios...",
                  logs: [
                    ...prev.logs,
                    {
                      time: new Date().toLocaleTimeString(),
                      message: "Items actualizados. Verificando cambios...",
                      type: "info",
                    },
                    {
                      time: new Date().toLocaleTimeString(),
                      message: "Se encontraron 156 nuevos items y 89 actualizaciones.",
                      type: "info",
                    },
                  ],
                }))

                setTimeout(() => {
                  setItemSyncStatus((prev) => ({
                    ...prev,
                    progress: 85,
                    currentStep: "Optimizando imágenes...",
                    logs: [
                      ...prev.logs,
                      {
                        time: new Date().toLocaleTimeString(),
                        message: "Optimizando imágenes para mejor rendimiento...",
                        type: "info",
                      },
                    ],
                  }))

                  setTimeout(() => {
                    const now = new Date().toLocaleString()
                    setItemSyncStatus((prev) => ({
                      ...prev,
                      isRunning: false,
                      progress: 100,
                      currentStep: "Sincronización completada",
                      lastSync: now,
                      logs: [
                        ...prev.logs,
                        {
                          time: new Date().toLocaleTimeString(),
                          message: "¡Sincronización de items completada con éxito!",
                          type: "success",
                        },
                      ],
                    }))

                    toast({
                      title: "Sincronización completada",
                      description: "Los items han sido actualizados correctamente.",
                    })
                  }, 1000)
                }, 1000)
              }, 1000)
            }, 1500)
          }, 2000)
        }, 1500)
      }, 1000)
    }, 1000)
  }

  const handleViewOrderDetails = (order: any) => {
    setSelectedOrder(order)
    setOrderDetailsOpen(true)
  }

  const handleViewUserPurchases = (user: any) => {
    setSelectedUser(user)
    setUserPurchasesOpen(true)
  }

  // Nuevos manejadores para los diálogos
  const handleEditUser = (user: any) => {
    setUserToEdit(user)
    setEditUserDialogOpen(true)
  }

  const handleSaveUser = (userData: any) => {
    setUsers(users.map((user) => (user.id === userData.id ? userData : user)))
  }

  const handleToggleUserStatus = (user: any) => {
    setUserToChangeStatus(user)
    setConfirmUserStatusDialogOpen(true)
  }

  const handleConfirmUserStatusChange = () => {
    if (!userToChangeStatus) return

    const newStatus = userToChangeStatus.status === "active" ? "suspended" : "active"

    setUsers(users.map((user) => (user.id === userToChangeStatus.id ? { ...user, status: newStatus } : user)))

    toast({
      title: newStatus === "active" ? "Usuario activado" : "Usuario suspendido",
      description: `El usuario ${userToChangeStatus.name} ha sido ${newStatus === "active" ? "activado" : "suspendido"} correctamente.`,
    })
  }

  const handleProcessOrder = (order: any) => {
    setOrderToProcess(order)
    setProcessOrderDialogOpen(true)
  }

  const handleOrderStatusChange = (orderId: string, newStatus: string, feedback?: string) => {
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: newStatus, feedback } : order)))
  }

  const handleToggleProductStatus = (product: any) => {
    setProductToChangeStatus(product)
    setConfirmProductStatusDialogOpen(true)
  }

  const handleConfirmProductStatusChange = () => {
    if (!productToChangeStatus) return

    const newStatus = productToChangeStatus.status === "active" ? "paused" : "active"

    setProducts(
      products.map((product) =>
        product.id === productToChangeStatus.id ? { ...product, status: newStatus } : product,
      ),
    )

    toast({
      title: newStatus === "active" ? "Producto activado" : "Producto pausado",
      description: `${productToChangeStatus.name} ha sido ${newStatus === "active" ? "activado" : "pausado"} correctamente.`,
    })
  }

  const handleSyncProduct = (product: any) => {
    setProductToSync(product)
    setConfirmSyncProductDialogOpen(true)
  }

  const handleConfirmSyncProduct = () => {
    if (!productToSync) return

    // Simulate product sync
    toast({
      title: "Sincronizando producto",
      description: "Obteniendo datos actualizados del producto...",
    })

    setTimeout(() => {
      // Update lastUpdated date
      setProducts(
        products.map((product) =>
          product.id === productToSync.id ? { ...product, lastUpdated: new Date().toLocaleDateString() } : product,
        ),
      )

      toast({
        title: "Producto sincronizado",
        description: "Los datos del producto han sido actualizados correctamente.",
      })
    }, 2000)
  }

  const handleEditProduct = (product: any) => {
    setProductToEdit(product)
    setEditProductDialogOpen(true)
  }

  const handleSaveProduct = (productData: any) => {
    // Update lastUpdated date
    const updatedProduct = {
      ...productData,
      lastUpdated: new Date().toLocaleDateString(),
    }

    setProducts(products.map((product) => (product.id === updatedProduct.id ? updatedProduct : product)))
  }

  const handleConfirmSync = () => {
    if (syncType === "prices") {
      handleSyncPrices()
    } else {
      handleSyncItems()
    }
  }

  const handleSyncConfigChange = (type: "autoSync" | "syncOnStartup", value: boolean) => {
    setSyncConfigAction({ type, value })
    setSyncConfigTitle(
      `${value ? "Activar" : "Desactivar"} ${type === "autoSync" ? "sincronización automática" : "sincronización al iniciar"}`,
    )
    setSyncConfigDescription(
      `¿Estás seguro de que deseas ${value ? "activar" : "desactivar"} ${
        type === "autoSync" ? "la sincronización automática" : "la sincronización al iniciar"
      }?`,
    )
    setConfirmSyncConfigOpen(true)
  }

  const confirmSyncConfigChange = () => {
    if (syncConfigAction) {
      setSyncConfig({
        ...syncConfig,
        [syncConfigAction.type]: syncConfigAction.value,
      })
      toast({
        title: "Configuración actualizada",
        description: `La configuración ha sido actualizada correctamente.`,
      })
    }
  }

  const handleToggleSitePause = () => {
    setPauseSiteDialogOpen(true)
  }

  const confirmToggleSitePause = () => {
    setSitePaused(!sitePaused)
    toast({
      title: sitePaused ? "Sitio reactivado" : "Sitio pausado",
      description: sitePaused
        ? "El sitio ha sido reactivado correctamente."
        : "El sitio ha sido pausado correctamente. Todas las transacciones están detenidas.",
      variant: sitePaused ? "default" : "destructive",
    })
  }

  // Añadir el manejador para el modo testing
  const handleToggleTestingMode = () => {
    setTestingModeDialogOpen(true)
  }

  const confirmToggleTestingMode = () => {
    // Primero guardamos el nuevo estado en localStorage
    const newTestingMode = !isTestingMode

    // Actualizamos el estado local primero
    setIsTestingMode(newTestingMode)

    // Luego actualizamos localStorage
    localStorage.setItem("testing-mode", newTestingMode ? "true" : "false")

    // Si estamos desactivando el modo testing, automáticamente damos acceso al sitio
    // Si estamos activando el modo testing, no cambiamos el site-access para el panel de administración
    if (!newTestingMode) {
      localStorage.setItem("site-access", "true")
    }

    toast({
      title: newTestingMode ? "Modo testing activado" : "Modo testing desactivado",
      description: newTestingMode
        ? "La landing page ha sido habilitada para todos los usuarios."
        : "La landing page ha sido deshabilitada. Los usuarios serán redirigidos directamente a Market.",
    })
  }

  // Función para calcular la próxima sincronización
  const getNextSyncTime = (interval: string) => {
    const now = new Date()
    const nextSync = new Date(now)
    nextSync.setHours(now.getHours() + Number.parseInt(interval))
    return nextSync.toLocaleString()
  }

  useEffect(() => {
    // Verificar si el usuario es administrador
    const adminSession = localStorage.getItem("admin-session")
    // Cargar el estado del modo testing
    const testingMode = localStorage.getItem("testing-mode") === "true"
    setIsTestingMode(testingMode)

    if (adminSession !== "true") {
      toast({
        variant: "destructive",
        title: "Acceso denegado",
        description: "No tienes permisos para acceder al panel de administración.",
      })
      router.push("/admin/login")
    } else {
      setIsLoading(false)
    }
  }, [router, toast])

  const handleLogout = () => {
    // Primero actualizamos el estado local
    setIsLoading(true)

    // Luego actualizamos localStorage
    localStorage.removeItem("admin-session")

    // Usamos router.push en lugar de window.location para evitar recargas completas
    router.push("/admin/login")
  }

  const handleThemeChange = (newTheme: "dark" | "vibrant") => {
    console.log("Changing theme to:", newTheme)
    setTheme(newTheme)
    toast({
      title: "Tema actualizado",
      description: `El tema ha sido cambiado a ${newTheme === "dark" ? "oscuro clásico" : "vibrante con colores neón"}.`,
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Panel de Administración</h1>
        <div className="flex items-center gap-4">
          <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm">
            Tema actual: {theme === "dark" ? "Oscuro Clásico" : "Vibrante Neón"}
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar sesión
          </Button>
        </div>
      </div>

      <Tabs defaultValue="dashboard">
        <TabsList className="mb-6">
          <TabsTrigger value="dashboard">
            <BarChart3 className="h-4 w-4 mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-2" />
            Usuarios
          </TabsTrigger>
          <TabsTrigger value="orders">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Pedidos
          </TabsTrigger>
          <TabsTrigger value="market">
            <Package className="h-4 w-4 mr-2" />
            Items
          </TabsTrigger>
          <TabsTrigger value="sync">
            <RefreshCw className="h-4 w-4 mr-2" />
            Sincronización
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Configuración
          </TabsTrigger>
          {/* Luego, en la sección de Tabs, agregamos una nueva pestaña para notificaciones */}
          {/* Busca esta línea: */}
          {/* <TabsList className="mb-6"> */}
          {/* Y agrega una nueva pestaña después de las existentes: */}
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notificaciones
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Usuarios Totales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-xs text-muted-foreground">+12% desde el mes pasado</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Ventas Totales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">ARS 2,543,000</div>
                <p className="text-xs text-muted-foreground">+5% desde el mes pasado</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pedidos Activos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45</div>
                <p className="text-xs text-muted-foreground">-2% desde el mes pasado</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Items Listados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">789</div>
                <p className="text-xs text-muted-foreground">+8% desde el mes pasado</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Usuarios</CardTitle>
              <CardDescription>Administra los usuarios registrados en la plataforma.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 space-y-4">
                <h3 className="text-sm font-medium">Filtros</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Buscar por nombre o ID" className="flex-1" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Buscar por email" className="flex-1" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="active">Activo</SelectItem>
                        <SelectItem value="suspended">Suspendido</SelectItem>
                        <SelectItem value="pending">Pendiente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button variant="outline" size="sm" className="gap-1">
                    <Filter className="h-4 w-4" />
                    Aplicar filtros
                  </Button>
                </div>
              </div>

              <div className="rounded-md border">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th className="h-12 px-4 text-left align-middle font-medium">Usuario</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Email</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Registro</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Estado</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                      {users.map((user) => (
                        <tr
                          key={user.id}
                          className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                        >
                          <td className="p-4 align-middle">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <User className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-xs text-muted-foreground">ID: {user.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 align-middle">{user.email}</td>
                          <td className="p-4 align-middle">{user.registrationDate}</td>
                          <td className="p-4 align-middle">
                            <Badge
                              variant="outline"
                              className={
                                user.status === "active"
                                  ? "bg-green-500/20 text-green-500 border-green-500/50"
                                  : user.status === "suspended"
                                    ? "bg-red-500/20 text-red-500 border-red-500/50"
                                    : "bg-yellow-500/20 text-yellow-500 border-yellow-500/50"
                              }
                            >
                              {user.status === "active"
                                ? "Activo"
                                : user.status === "suspended"
                                  ? "Suspendido"
                                  : "Pendiente"}
                            </Badge>
                          </td>
                          <td className="p-4 align-middle">
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => handleEditUser(user)}>
                                <Edit className="h-4 w-4 mr-1" />
                                Editar
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-primary"
                                onClick={() =>
                                  handleViewUserPurchases({
                                    id: user.id,
                                    name: user.name,
                                    email: user.email,
                                  })
                                }
                              >
                                <History className="h-4 w-4 mr-1" />
                                Historial
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className={user.status === "active" ? "text-destructive" : "text-green-600"}
                                onClick={() => handleToggleUserStatus(user)}
                              >
                                {user.status === "active" ? "Suspender" : "Activar"}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Pedidos</CardTitle>
              <CardDescription>Administra los pedidos realizados en la plataforma.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 space-y-4">
                <h3 className="text-sm font-medium">Filtros</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Buscar por ID de pedido" className="flex-1" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Buscar por cliente" className="flex-1" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <Input type="date" placeholder="Fecha desde" className="flex-1" />
                    <Input type="date" placeholder="Fecha hasta" className="flex-1" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Monto mínimo" className="flex-1" />
                    <Input placeholder="Monto máximo" className="flex-1" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="completed">Completado</SelectItem>
                        <SelectItem value="pending">Pendiente</SelectItem>
                        <SelectItem value="processing">En proceso</SelectItem>
                        <SelectItem value="cancelled">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Método de pago" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="mercadopago">MercadoPago</SelectItem>
                        <SelectItem value="transfer">Transferencia bancaria</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button variant="outline" size="sm" className="gap-1">
                    <Filter className="h-4 w-4" />
                    Aplicar filtros
                  </Button>
                </div>
              </div>

              <div className="rounded-md border">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th className="h-12 px-4 text-left align-middle font-medium">Pedido</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Cliente</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Fecha</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Monto</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Método de pago</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Estado</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                      {orders.map((order) => (
                        <tr
                          key={order.id}
                          className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                        >
                          <td className="p-4 align-middle font-medium">{order.id}</td>
                          <td className="p-4 align-middle">{order.customer}</td>
                          <td className="p-4 align-middle">{order.date}</td>
                          <td className="p-4 align-middle">ARS {order.total.toLocaleString()}</td>
                          <td className="p-4 align-middle">{order.paymentMethod}</td>
                          <td className="p-4 align-middle">
                            <Badge
                              variant="outline"
                              className={
                                order.status === "completed"
                                  ? "bg-green-500/20 text-green-500 border-green-500/50"
                                  : order.status === "pending"
                                    ? "bg-yellow-500/20 text-yellow-500 border-yellow-500/50"
                                    : order.status === "processing"
                                      ? "bg-blue-500/20 text-blue-500 border-blue-500/50"
                                      : "bg-red-500/20 text-red-500 border-red-500/50"
                              }
                            >
                              {order.status === "completed"
                                ? "Completado"
                                : order.status === "pending"
                                  ? "Pendiente"
                                  : order.status === "processing"
                                    ? "En proceso"
                                    : "Cancelado"}
                            </Badge>
                          </td>
                          <td className="p-4 align-middle">
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => handleViewOrderDetails(order)}>
                                <Eye className="h-4 w-4 mr-1" />
                                Ver detalles
                              </Button>
                              {order.status !== "completed" && order.status !== "cancelled" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-primary"
                                  onClick={() => handleProcessOrder(order)}
                                >
                                  Procesar
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="market">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Items</CardTitle>
              <CardDescription>Administra los items disponibles en el marketplace.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 space-y-4">
                <h3 className="text-sm font-medium">Filtros</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Buscar por nombre" className="flex-1" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas</SelectItem>
                        <SelectItem value="rifle">Rifle</SelectItem>
                        <SelectItem value="pistola">Pistola</SelectItem>
                        <SelectItem value="cuchillo">Cuchillo</SelectItem>
                        <SelectItem value="awp">AWP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="active">Activo</SelectItem>
                        <SelectItem value="paused">Pausado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button variant="outline" size="sm" className="gap-1">
                    <Filter className="h-4 w-4" />
                    Aplicar filtros
                  </Button>
                </div>
              </div>

              <div className="rounded-md border">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th className="h-12 px-4 text-left align-middle font-medium">Producto</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Categoría</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Precio</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Stock</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Última actualización</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Estado</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                      {products.map((product) => (
                        <tr
                          key={product.id}
                          className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                        >
                          <td className="p-4 align-middle">
                            <div className="flex items-center gap-3">
                              <div className="relative w-10 h-10">
                                <Image
                                  src={product.image || "/placeholder.svg"}
                                  alt={product.name}
                                  fill
                                  className="object-contain"
                                />
                              </div>
                              <div>
                                <p className="font-medium">{product.name}</p>
                                <p className="text-xs text-muted-foreground">ID: #{product.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 align-middle">{product.category}</td>
                          <td className="p-4 align-middle">ARS {product.price.toLocaleString()}</td>
                          <td className="p-4 align-middle">{product.stock}</td>
                          <td className="p-4 align-middle">{product.lastUpdated}</td>
                          <td className="p-4 align-middle">
                            <Badge
                              variant="outline"
                              className={
                                product.status === "active"
                                  ? "bg-green-500/20 text-green-500 border-green-500/50"
                                  : "bg-yellow-500/20 text-yellow-500 border-yellow-500/50"
                              }
                            >
                              {product.status === "active" ? "Activo" : "Pausado"}
                            </Badge>
                          </td>
                          <td className="p-4 align-middle">
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => handleToggleProductStatus(product)}>
                                {product.status === "active" ? (
                                  <>
                                    <PauseCircle className="h-4 w-4 mr-1" /> Pausar
                                  </>
                                ) : (
                                  <>
                                    <PlayCircle className="h-4 w-4 mr-1" /> Activar
                                  </>
                                )}
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleEditProduct(product)}>
                                <Edit className="h-4 w-4 mr-1" />
                                Editar
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleSyncProduct(product)}>
                                <RefreshCw className="h-4 w-4 mr-1" />
                                Sync
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sync">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sincronización de Productos</CardTitle>
                <CardDescription>
                  Sincroniza los precios y datos de los productos desde fuentes externas.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Sincronización de Precios */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Sincronización de Precios</CardTitle>
                      <CardDescription>Actualiza los precios de todos los productos</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">Estado</h4>
                          <p className="text-sm text-muted-foreground">
                            {syncStatus.isRunning
                              ? `Sincronizando: ${syncStatus.currentStep}`
                              : syncStatus.lastSync
                                ? `Última sincronización: ${syncStatus.lastSync}`
                                : "No se ha sincronizado recientemente"}
                          </p>
                        </div>
                        <Button variant="destructive" onClick={handleSyncAllProducts} disabled={syncStatus.isRunning}>
                          {syncStatus.isRunning ? (
                            <>
                              <Spinner className="mr-2 h-4 w-4" />
                              Sincronizando...
                            </>
                          ) : (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Sincronizar Precios
                            </>
                          )}
                        </Button>
                      </div>

                      {/* Espacio fijo para la barra de progreso */}
                      <div className="h-10">
                        {syncStatus.isRunning && (
                          <div className="space-y-2">
                            <div className="h-2 bg-secondary rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary transition-all duration-500 ease-in-out"
                                style={{ width: `${syncStatus.progress}%` }}
                              />
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {syncStatus.progress}% completado - {syncStatus.currentStep}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Configuración</h4>
                        <div className="grid gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="priceInterval">Intervalo de sincronización</Label>
                            <div className="flex gap-2">
                              <Select
                                value={syncConfig.priceInterval}
                                onValueChange={(value) => setSyncConfig({ ...syncConfig, priceInterval: value })}
                              >
                                <SelectTrigger id="priceInterval">
                                  <SelectValue placeholder="Seleccionar intervalo" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1">Cada hora</SelectItem>
                                  <SelectItem value="6">Cada 6 horas</SelectItem>
                                  <SelectItem value="12">Cada 12 horas</SelectItem>
                                  <SelectItem value="24">Cada 24 horas</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button variant="secondary" size="sm">
                                Guardar
                              </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Próxima sincronización:{" "}
                              {syncStatus.lastSync ? getNextSyncTime(syncConfig.priceInterval) : "No programada"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-2">Registro de actividad</h4>
                        <SyncLog logs={syncStatus.logs} maxHeight="200px" />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Sincronización de Items */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Sincronización de Items</CardTitle>
                      <CardDescription>Actualiza los datos y metadatos de todos los items</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">Estado</h4>
                          <p className="text-sm text-muted-foreground">
                            {itemSyncStatus.isRunning
                              ? `Sincronizando: ${itemSyncStatus.currentStep}`
                              : itemSyncStatus.lastSync
                                ? `Última sincronización: ${itemSyncStatus.lastSync}`
                                : "No se ha sincronizado recientemente"}
                          </p>
                        </div>
                        <Button variant="destructive" onClick={handleSyncAllItems} disabled={itemSyncStatus.isRunning}>
                          {itemSyncStatus.isRunning ? (
                            <>
                              <Spinner className="mr-2 h-4 w-4" />
                              Sincronizando...
                            </>
                          ) : (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Sincronizar Items
                            </>
                          )}
                        </Button>
                      </div>

                      {/* Espacio fijo para la barra de progreso */}
                      <div className="h-10">
                        {itemSyncStatus.isRunning && (
                          <div className="space-y-2">
                            <div className="h-2 bg-secondary rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary transition-all duration-500 ease-in-out"
                                style={{ width: `${itemSyncStatus.progress}%` }}
                              />
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {itemSyncStatus.progress}% completado - {itemSyncStatus.currentStep}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Configuración</h4>
                        <div className="grid gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="itemInterval">Intervalo de sincronización</Label>
                            <div className="flex gap-2">
                              <Select
                                value={syncConfig.itemInterval}
                                onValueChange={(value) => setSyncConfig({ ...syncConfig, itemInterval: value })}
                              >
                                <SelectTrigger id="itemInterval">
                                  <SelectValue placeholder="Seleccionar intervalo" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1">Cada hora</SelectItem>
                                  <SelectItem value="6">Cada 6 horas</SelectItem>
                                  <SelectItem value="12">Cada 12 horas</SelectItem>
                                  <SelectItem value="24">Cada 24 horas</SelectItem>
                                  <SelectItem value="48">Cada 2 días</SelectItem>
                                  <SelectItem value="168">Cada semana</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button variant="secondary" size="sm">
                                Guardar
                              </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Próxima sincronización:{" "}
                              {itemSyncStatus.lastSync ? getNextSyncTime(syncConfig.itemInterval) : "No programada"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-2">Registro de actividad</h4>
                        <SyncLog logs={itemSyncStatus.logs} maxHeight="200px" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-6">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Configuración General de Sincronización</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="autoSync">Sincronización automática</Label>
                            <p className="text-sm text-muted-foreground">
                              Sincronizar automáticamente según los intervalos configurados
                            </p>
                          </div>
                          <Switch
                            id="autoSync"
                            checked={syncConfig.autoSync}
                            onCheckedChange={(checked) => handleSyncConfigChange("autoSync", checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="syncOnStartup">Sincronizar al iniciar</Label>
                            <p className="text-sm text-muted-foreground">
                              Ejecutar sincronización al iniciar el sistema
                            </p>
                          </div>
                          <Switch
                            id="syncOnStartup"
                            checked={syncConfig.syncOnStartup}
                            onCheckedChange={(checked) => handleSyncConfigChange("syncOnStartup", checked)}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuración General</CardTitle>
                <CardDescription>Administra la configuración general de la plataforma.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Tema */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Tema del sitio</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card
                        className={`cursor-pointer transition-all ${theme === "dark" ? "ring-2 ring-primary" : ""}`}
                        onClick={() => handleThemeChange("dark")}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="bg-background border-2 border-border p-2 rounded-full">
                              <Moon className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">Tema Oscuro Clásico</h4>
                              <p className="text-sm text-muted-foreground">
                                El tema oscuro original con colores neutros
                              </p>
                            </div>
                            {theme === "dark" && (
                              <div className="bg-primary text-primary-foreground p-1 rounded-full">
                                <Check className="h-4 w-4" />
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>

                      <Card
                        className={`cursor-pointer transition-all ${theme === "vibrant" ? "ring-2 ring-primary" : ""}`}
                        onClick={() => handleThemeChange("vibrant")}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="bg-background border-2 border-border p-2 rounded-full">
                              <Palette className="h-6 w-6 text-accent" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">Tema Vibrante Neón</h4>
                              <p className="text-sm text-muted-foreground">Colores vibrantes con rosa y cian</p>
                            </div>
                            {theme === "vibrant" && (
                              <div className="bg-primary text-primary-foreground p-1 rounded-full">
                                <Check className="h-4 w-4" />
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <Separator />

                  {/* Otras configuraciones */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Otras configuraciones</h3>
                    <div className="space-y-4">
                      <Card className="border-2 border-destructive">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-destructive" />
                            Modo de emergencia
                          </CardTitle>
                          <CardDescription>
                            Pausar todas las operaciones del sitio en caso de emergencia
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <p className="font-medium">Estado actual del sitio</p>
                                <p className="text-sm text-muted-foreground">
                                  {sitePaused
                                    ? "El sitio está actualmente pausado. Todas las transacciones están detenidas."
                                    : "El sitio está activo y funcionando normalmente."}
                                </p>
                              </div>
                              <Badge
                                variant="outline"
                                className={
                                  sitePaused
                                    ? "bg-red-500/20 text-red-500 border-red-500/50"
                                    : "bg-green-500/20 text-green-500 border-green-500/50"
                                }
                              >
                                {sitePaused ? "Pausado" : "Activo"}
                              </Badge>
                            </div>
                            <Button
                              variant={sitePaused ? "default" : "destructive"}
                              className="w-full"
                              onClick={handleToggleSitePause}
                            >
                              {sitePaused ? "Reactivar sitio" : "Pausar sitio"}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Beaker className="h-5 w-5 text-primary" />
                            Modo testing
                          </CardTitle>
                          <CardDescription>Habilitar/deshabilitar la landing page para pruebas</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <p className="font-medium">Estado actual del modo testing</p>
                                <p className="text-sm text-muted-foreground">
                                  {isTestingMode
                                    ? "El modo testing está activo. La landing page está habilitada para todos los usuarios."
                                    : "El modo testing está inactivo. La landing page está deshabilitada y los usuarios son redirigidos a Market."}
                                </p>
                              </div>
                              <Badge
                                variant="outline"
                                className={
                                  isTestingMode
                                    ? "bg-yellow-500/20 text-yellow-500 border-yellow-500/50"
                                    : "bg-red-500/20 text-red-500 border-red-500/50"
                                }
                              >
                                {isTestingMode ? "Activo" : "Inactivo"}
                              </Badge>
                            </div>
                            <Button
                              variant="outline"
                              className={`w-full ${isTestingMode ? "border-yellow-500 text-yellow-500 hover:bg-yellow-500/10" : ""}`}
                              onClick={handleToggleTestingMode}
                            >
                              {isTestingMode ? "Desactivar modo testing" : "Activar modo testing"}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        {/* Ahora, después de todos los TabsContent existentes, agrega el contenido para la pestaña de notificaciones: */}
        <TabsContent value="notifications">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Notificaciones</CardTitle>
                <CardDescription>Crea y administra notificaciones para los usuarios de la plataforma.</CardDescription>
              </CardHeader>
              <CardContent>
                <NotificationsManager />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Diálogo de detalles de pedido */}
      <Dialog open={orderDetailsOpen} onOpenChange={setOrderDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detalles del Pedido {selectedOrder?.id}</DialogTitle>
            <DialogDescription>Información completa del pedido realizado el {selectedOrder?.date}</DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              {/* Información general */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Cliente</p>
                  <p className="font-medium">{selectedOrder.customer}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Método de pago</p>
                  <p className="font-medium">{selectedOrder.paymentMethod}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Estado</p>
                  <Badge
                    variant="outline"
                    className={
                      selectedOrder.status === "completed"
                        ? "bg-green-500/20 text-green-500 border-green-500/50"
                        : selectedOrder.status === "pending"
                          ? "bg-yellow-500/20 text-yellow-500 border-yellow-500/50"
                          : selectedOrder.status === "processing"
                            ? "bg-blue-500/20 text-blue-500 border-blue-500/50"
                            : "bg-red-500/20 text-red-500 border-red-500/50"
                    }
                  >
                    {selectedOrder.status === "completed"
                      ? "Completado"
                      : selectedOrder.status === "pending"
                        ? "Pendiente"
                        : selectedOrder.status === "processing"
                          ? "En proceso"
                          : "Cancelado"}
                  </Badge>
                </div>
              </div>

              <Separator />

              {/* Items del pedido */}
              <div>
                <h3 className="font-medium mb-4">Productos</h3>
                <div className="space-y-4">
                  {selectedOrder.items.map((item: any) => (
                    <div key={item.id} className="flex gap-4 border rounded-lg p-4">
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-contain" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-sm">
                          <p className="text-muted-foreground">
                            Float: <span className="text-foreground">{item.float}</span>
                          </p>
                          <p className="text-muted-foreground">
                            Patrón: <span className="text-foreground">{item.pattern}</span>
                          </p>
                          <p className="text-muted-foreground">
                            Calidad: <span className="text-foreground">{item.quality}</span>
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">ARS {item.price.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Resumen */}
              <div>
                <h3 className="font-medium mb-4">Resumen</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>ARS {selectedOrder.total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Comisión</span>
                    <span>ARS 0.00</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>ARS {selectedOrder.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Acciones */}
              {selectedOrder.status === "pending" && (
                <div className="flex justify-end gap-2">
                  <Button variant="outline" className="text-destructive">
                    Rechazar
                  </Button>
                  <Button>Aprobar y procesar</Button>
                </div>
              )}
              {selectedOrder.status === "processing" && (
                <div className="flex justify-end gap-2">
                  <Button>Marcar como completado</Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Diálogo de historial de compras de usuario */}
      <Dialog open={userPurchasesOpen} onOpenChange={setUserPurchasesOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Historial de Compras</DialogTitle>
            <DialogDescription>
              Compras realizadas por {selectedUser?.name} ({selectedUser?.email})
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-6">
              {userPurchases.length === 0 ? (
                <div className="text-center py-6">
                  <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No hay compras registradas</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Este usuario no ha realizado compras en la plataforma.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {userPurchases.map((purchase) => (
                    <div key={purchase.id} className="border rounded-lg overflow-hidden">
                      <div className="bg-muted p-4 flex justify-between items-center">
                        <div>
                          <p className="font-medium">{purchase.id}</p>
                          <p className="text-sm text-muted-foreground">{purchase.date}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge
                            variant="outline"
                            className={
                              purchase.status === "completed"
                                ? "bg-green-500/20 text-green-500 border-green-500/50"
                                : "bg-yellow-500/20 text-yellow-500 border-yellow-500/50"
                            }
                          >
                            {purchase.status === "completed" ? "Completado" : "Pendiente"}
                          </Badge>
                          <p className="font-medium">ARS {purchase.total.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="p-4 space-y-4">
                        {purchase.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-4">
                            <div className="relative w-16 h-16 flex-shrink-0">
                              <Image
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                fill
                                className="object-contain"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-muted-foreground">ARS {item.price.toLocaleString()}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="bg-muted p-4 flex justify-between">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Método de pago: </span>
                          <span>{purchase.paymentMethod}</span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setUserPurchasesOpen(false)
                            // Simular que se abre el detalle del pedido
                            setTimeout(() => {
                              handleViewOrderDetails({
                                id: purchase.id,
                                customer: selectedUser.name,
                                date: purchase.date,
                                total: purchase.total,
                                paymentMethod: purchase.paymentMethod,
                                status: purchase.status,
                                items: purchase.items,
                              })
                            }, 100)
                          }}
                        >
                          Ver detalles
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Diálogos nuevos */}
      <EditUserDialog
        open={editUserDialogOpen}
        onOpenChange={setEditUserDialogOpen}
        user={userToEdit}
        onSave={handleSaveUser}
      />

      <ConfirmUserStatusDialog
        open={confirmUserStatusDialogOpen}
        onOpenChange={setConfirmUserStatusDialogOpen}
        user={userToChangeStatus}
        onConfirm={handleConfirmUserStatusChange}
      />

      <ProcessOrderDialog
        open={processOrderDialogOpen}
        onOpenChange={setProcessOrderDialogOpen}
        order={orderToProcess}
        onStatusChange={handleOrderStatusChange}
      />

      <ConfirmProductStatusDialog
        open={confirmProductStatusDialogOpen}
        onOpenChange={setConfirmProductStatusDialogOpen}
        product={productToChangeStatus}
        onConfirm={handleConfirmProductStatusChange}
      />

      <ConfirmSyncProductDialog
        open={confirmSyncProductDialogOpen}
        onOpenChange={setConfirmSyncProductDialogOpen}
        product={productToSync}
        onConfirm={handleConfirmSyncProduct}
      />

      <EditProductDialog
        open={editProductDialogOpen}
        onOpenChange={setEditProductDialogOpen}
        product={productToEdit}
        onSave={handleSaveProduct}
      />

      <ConfirmSyncAllDialog
        open={confirmSyncAllDialogOpen}
        onOpenChange={setConfirmSyncAllDialogOpen}
        onConfirm={handleConfirmSync}
      />

      <ConfirmSyncConfigDialog
        open={confirmSyncConfigOpen}
        onOpenChange={setConfirmSyncConfigOpen}
        title={syncConfigTitle}
        description={syncConfigDescription}
        onConfirm={confirmSyncConfigChange}
      />

      <PauseSiteDialog
        open={pauseSiteDialogOpen}
        onOpenChange={setPauseSiteDialogOpen}
        isPaused={sitePaused}
        onConfirm={confirmToggleSitePause}
      />

      <TestingModeDialog
        open={testingModeDialogOpen}
        onOpenChange={setTestingModeDialogOpen}
        isTestingMode={isTestingMode}
        onConfirm={confirmToggleTestingMode}
      />
    </div>
  )
}

