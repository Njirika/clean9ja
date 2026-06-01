import * as React from "react"
import { cn } from "../../utils/cn"

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div className={cn("bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden", className)} {...props}>
      {children}
    </div>
  )
}

export function CardHeader({ className, children }: { className?: string, children: React.ReactNode }) {
  return <div className={cn("p-6", className)}>{children}</div>
}

export function CardContent({ className, children }: { className?: string, children: React.ReactNode }) {
  return <div className={cn("px-6 pb-6", className)}>{children}</div>
}

export function CardFooter({ className, children }: { className?: string, children: React.ReactNode }) {
  return <div className={cn("px-6 py-4 bg-gray-50", className)}>{children}</div>
}
