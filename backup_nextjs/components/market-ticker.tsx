"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { type IndexData, getMockIndexData } from "@/lib/crypto-api"

export function MarketTicker() {
  const [indices, setIndices] = useState<IndexData[]>([])

  useEffect(() => {
    setIndices(getMockIndexData())

    // Simulate live updates
    const interval = setInterval(() => {
      setIndices((prev) =>
        prev.map((index) => ({
          ...index,
          value: index.value + (Math.random() - 0.5) * 10,
          change: index.change + (Math.random() - 0.5) * 2,
          changePercent: index.changePercent + (Math.random() - 0.5) * 0.1,
        })),
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // Double the array for seamless looping
  const tickerItems = [...indices, ...indices]

  return (
    <div className="bg-card border-b border-border overflow-hidden">
      <div className="animate-ticker flex whitespace-nowrap py-2">
        {tickerItems.map((index, i) => (
          <Link
            key={`${index.name}-${i}`}
            href={`/screener/index/${index.name.toLowerCase().replace(/\s+/g, "-")}`}
            className="inline-flex items-center gap-3 px-6 border-r border-border hover:bg-muted/50 transition-colors"
          >
            <span className="font-medium">{index.name}</span>
            <span className="font-mono">{index.value.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
            <span className={cn("font-mono text-sm", index.change >= 0 ? "text-chart-1" : "text-chart-2")}>
              {index.change >= 0 ? "+" : ""}
              {index.change.toFixed(2)} ({index.changePercent >= 0 ? "+" : ""}
              {index.changePercent.toFixed(2)}%)
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
