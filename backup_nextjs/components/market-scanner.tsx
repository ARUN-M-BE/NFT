"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface ScannerStock {
  name: string
  symbol: string
  price: number
  change: number
  signal: string
}

const scannerData = {
  bullish: [
    { name: "Zydus Life Science", symbol: "ZYDUS", price: 1002.35, change: 1.49, signal: "2 Week High Break" },
    { name: "Sammaan Capital", symbol: "SAMMAAN", price: 171.99, change: 3.14, signal: "2 Week High Break" },
    { name: "Bajaj Auto", symbol: "BAJAJ-AUTO", price: 9234.5, change: 2.45, signal: "Resistance Break" },
  ],
  bearish: [
    { name: "Poonawalla Fincorp", symbol: "POONAWALLA", price: 511.9, change: -2.75, signal: "Support 2 Breached" },
    { name: "EID Parry", symbol: "EIDPARRY", price: 1028.6, change: -0.63, signal: "2 Week Low Break" },
    { name: "Vodafone Idea", symbol: "IDEA", price: 12.45, change: -4.23, signal: "Below Support" },
  ],
  nearLow: [
    { name: "IPCA Laboratories", symbol: "IPCA", price: 1271.0, change: -1.19, signal: "10% near 52 Week Low" },
    { name: "Aditya Birla Lifestyle", symbol: "ABFRL", price: 137.81, change: 1.01, signal: "5% near 52 Week Low" },
  ],
  nearHigh: [
    { name: "Jio Financial Services", symbol: "JIOFIN", price: 310.7, change: 0.45, signal: "10% near 52 Week High" },
    { name: "Alkem Laboratories", symbol: "ALKEM", price: 5557.0, change: -0.44, signal: "10% near 52 Week High" },
  ],
}

function ScannerCard({
  title,
  stocks,
  type,
  href,
}: {
  title: string
  stocks: ScannerStock[]
  type: "bullish" | "bearish" | "nearLow" | "nearHigh"
  href: string
}) {
  const icons = {
    bullish: TrendingUp,
    bearish: TrendingDown,
    nearLow: ArrowDownRight,
    nearHigh: ArrowUpRight,
  }
  const Icon = icons[type]

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <Link href={href} className="flex items-center justify-between group">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Icon
              className={cn("h-4 w-4", type === "bullish" || type === "nearHigh" ? "text-chart-1" : "text-chart-2")}
            />
            {title}
          </CardTitle>
          <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">view more →</span>
        </Link>
      </CardHeader>
      <CardContent className="space-y-3">
        {stocks.map((stock) => (
          <Link
            key={stock.symbol}
            href={`/company/${stock.symbol.toLowerCase()}`}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div>
              <p className="font-medium text-sm">{stock.name}</p>
              <p className="text-xs text-muted-foreground">{stock.signal}</p>
            </div>
            <div className="text-right">
              <p className="font-mono text-sm">₹{stock.price.toLocaleString("en-IN")}</p>
              <Badge
                variant="secondary"
                className={cn(
                  "font-mono text-xs",
                  stock.change >= 0 ? "bg-chart-1/10 text-chart-1" : "bg-chart-2/10 text-chart-2",
                )}
              >
                {stock.change >= 0 ? "+" : ""}
                {stock.change.toFixed(2)}%
              </Badge>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}

export function MarketScanner() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Live Market Scanner</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <ScannerCard title="Bullish Signal" stocks={scannerData.bullish} type="bullish" href="/live-market/bullish" />
          <ScannerCard title="Bearish Signal" stocks={scannerData.bearish} type="bearish" href="/live-market/bearish" />
          <ScannerCard
            title="Near Low Signal"
            stocks={scannerData.nearLow}
            type="nearLow"
            href="/live-market/near-low"
          />
          <ScannerCard
            title="Near High Signal"
            stocks={scannerData.nearHigh}
            type="nearHigh"
            href="/live-market/near-high"
          />
        </div>
      </div>
    </section>
  )
}
