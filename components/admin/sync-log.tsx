"use client"

import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

type LogEntry = {
  time: string
  message: string
  type: "info" | "error" | "success" | "warning"
}

type SyncLogProps = {
  logs: LogEntry[]
  className?: string
}

export function SyncLog({ logs, className }: SyncLogProps) {
  return (
    <Card className={cn("bg-muted", className)}>
      <ScrollArea className="h-[200px] p-4">
        <div className="space-y-1 font-mono text-sm">
          {logs.map((log, index) => (
            <div key={index} className="flex items-start gap-2">
              <span className="text-muted-foreground whitespace-nowrap">[{log.time}]</span>
              <span
                className={cn(
                  "break-words",
                  log.type === "error" && "text-destructive",
                  log.type === "success" && "text-green-500",
                  log.type === "warning" && "text-yellow-500",
                )}
              >
                {log.message}
              </span>
            </div>
          ))}
          {logs.length === 0 && <div className="text-muted-foreground italic">No hay registros disponibles</div>}
        </div>
      </ScrollArea>
    </Card>
  )
}

