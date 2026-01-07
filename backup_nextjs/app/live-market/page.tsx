import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MarketTicker } from "@/components/market-ticker"
import { MarketScanner } from "@/components/market-scanner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getMockStockData } from "@/lib/crypto-api"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import Link from "next/link"

export default function LiveMarketPage() {
  const stocks = getMockStockData()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <MarketTicker />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Live Market Scanner</h1>
            <p className="text-muted-foreground">Real-time signals and market analysis for Indian stocks</p>
          </div>

          <MarketScanner />

          <section className="py-8">
            <Card>
              <CardHeader>
                <CardTitle>Top Gainers & Losers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h3 className="font-semibold mb-4 text-chart-1 flex items-center gap-2">
                      <ArrowUpRight className="h-4 w-4" />
                      Top Gainers
                    </h3>
                    <div className="space-y-2">
                      {stocks
                        .filter((s) => s.changePercent > 0)
                        .sort((a, b) => b.changePercent - a.changePercent)
                        .slice(0, 5)
                        .map((stock) => (
                          <Link
                            key={stock.symbol}
                            href={`/company/${stock.symbol.toLowerCase()}`}
                            className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                          >
                            <div>
                              <p className="font-medium">{stock.symbol}</p>
                              <p className="text-xs text-muted-foreground">{stock.name}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-mono">₹{stock.price.toLocaleString("en-IN")}</p>
                              <Badge className="bg-chart-1/10 text-chart-1">+{stock.changePercent.toFixed(2)}%</Badge>
                            </div>
                          </Link>
                        ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4 text-chart-2 flex items-center gap-2">
                      <ArrowDownRight className="h-4 w-4" />
                      Top Losers
                    </h3>
                    <div className="space-y-2">
                      {stocks
                        .filter((s) => s.changePercent < 0)
                        .sort((a, b) => a.changePercent - b.changePercent)
                        .slice(0, 5)
                        .map((stock) => (
                          <Link
                            key={stock.symbol}
                            href={`/company/${stock.symbol.toLowerCase()}`}
                            className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                          >
                            <div>
                              <p className="font-medium">{stock.symbol}</p>
                              <p className="text-xs text-muted-foreground">{stock.name}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-mono">₹{stock.price.toLocaleString("en-IN")}</p>
                              <Badge className="bg-chart-2/10 text-chart-2">{stock.changePercent.toFixed(2)}%</Badge>
                            </div>
                          </Link>
                        ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
