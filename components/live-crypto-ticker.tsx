"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { type CryptoPrice, fetchCryptoPrices } from "@/lib/crypto-api"

export function LiveCryptoTicker() {
  const [cryptos, setCryptos] = useState<CryptoPrice[]>([])

  useEffect(() => {
    fetchCryptoPrices().then(setCryptos)

    // Poll for updates every 30 seconds
    const interval = setInterval(() => {
      fetchCryptoPrices().then(setCryptos)
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  // Double the array for seamless looping
  const tickerItems = [...cryptos.slice(0, 10), ...cryptos.slice(0, 10)]

  return (
    <div className="bg-primary/5 border-b border-border overflow-hidden">
      <div className="animate-ticker flex whitespace-nowrap py-2">
        {tickerItems.map((crypto, i) => (
          <Link
            key={`${crypto.id}-${i}`}
            href={`/crypto/${crypto.id}`}
            className="inline-flex items-center gap-3 px-6 border-r border-border hover:bg-muted/50 transition-colors"
          >
            <Image
              src={crypto.image || "/placeholder.svg"}
              alt={crypto.name}
              width={20}
              height={20}
              className="rounded-full"
            />
            <span className="font-medium uppercase">{crypto.symbol}</span>
            <span className="font-mono">
              ${crypto.current_price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span
              className={cn(
                "font-mono text-sm",
                crypto.price_change_percentage_24h >= 0 ? "text-chart-1" : "text-chart-2",
              )}
            >
              {crypto.price_change_percentage_24h >= 0 ? "+" : ""}
              {crypto.price_change_percentage_24h.toFixed(2)}%
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
