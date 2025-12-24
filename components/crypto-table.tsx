"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowUpRight, ArrowDownRight, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { type CryptoPrice, fetchCryptoPrices } from "@/lib/crypto-api"

function MiniSparkline({ data, positive }: { data: number[]; positive: boolean }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min

  const points = data
    .slice(-24)
    .map((value, index) => {
      const x = (index / 23) * 80
      const y = 20 - ((value - min) / range) * 16
      return `${x},${y}`
    })
    .join(" ")

  return (
    <svg width="80" height="24" className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke={positive ? "oklch(0.55 0.22 145)" : "oklch(0.55 0.22 25)"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function CryptoTable({ limit = 10 }: { limit?: number }) {
  const [cryptos, setCryptos] = useState<CryptoPrice[]>([])
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchCryptoPrices().then((data) => setCryptos(data.slice(0, limit)))

    const interval = setInterval(() => {
      fetchCryptoPrices().then((data) => setCryptos(data.slice(0, limit)))
    }, 30000)

    return () => clearInterval(interval)
  }, [limit])

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const formatNumber = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`
    return `$${num.toLocaleString()}`
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Live Cryptocurrency Prices</CardTitle>
        <Button variant="outline" size="sm" asChild>
          <Link href="/crypto">View All</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10"></TableHead>
              <TableHead className="w-10">#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">24h %</TableHead>
              <TableHead className="text-right hidden md:table-cell">Market Cap</TableHead>
              <TableHead className="text-right hidden lg:table-cell">Volume (24h)</TableHead>
              <TableHead className="hidden lg:table-cell">Last 7 Days</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cryptos.map((crypto, index) => (
              <TableRow key={crypto.id} className="group">
                <TableCell>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => toggleFavorite(crypto.id)}>
                    <Star
                      className={cn(
                        "h-4 w-4",
                        favorites.has(crypto.id) ? "fill-warning text-warning" : "text-muted-foreground",
                      )}
                    />
                  </Button>
                </TableCell>
                <TableCell className="font-mono text-muted-foreground">{index + 1}</TableCell>
                <TableCell>
                  <Link
                    href={`/crypto/${crypto.id}`}
                    className="flex items-center gap-3 hover:text-primary transition-colors"
                  >
                    <Image
                      src={crypto.image || "/placeholder.svg"}
                      alt={crypto.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <div>
                      <p className="font-medium">{crypto.name}</p>
                      <p className="text-xs text-muted-foreground uppercase">{crypto.symbol}</p>
                    </div>
                  </Link>
                </TableCell>
                <TableCell className="text-right font-mono">
                  $
                  {crypto.current_price.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: crypto.current_price < 1 ? 6 : 2,
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <Badge
                    variant="secondary"
                    className={cn(
                      "font-mono",
                      crypto.price_change_percentage_24h >= 0
                        ? "bg-chart-1/10 text-chart-1"
                        : "bg-chart-2/10 text-chart-2",
                    )}
                  >
                    {crypto.price_change_percentage_24h >= 0 ? (
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                    )}
                    {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-mono hidden md:table-cell">
                  {formatNumber(crypto.market_cap)}
                </TableCell>
                <TableCell className="text-right font-mono hidden lg:table-cell">
                  {formatNumber(crypto.total_volume)}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {crypto.sparkline_in_7d && (
                    <MiniSparkline
                      data={crypto.sparkline_in_7d.price}
                      positive={crypto.price_change_percentage_24h >= 0}
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
