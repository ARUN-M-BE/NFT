"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MarketTicker } from "@/components/market-ticker"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { getMockStockData } from "@/lib/crypto-api"
import { Search, Plus, X, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { cn } from "@/lib/utils"

export default function ComparePage() {
  const allStocks = getMockStockData()
  const [selectedStocks, setSelectedStocks] = useState<string[]>(["RELIANCE", "TCS"])
  const [searchTerm, setSearchTerm] = useState("")

  const filteredStocks = allStocks.filter(
    (stock) =>
      !selectedStocks.includes(stock.symbol) &&
      (stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const addStock = (symbol: string) => {
    if (selectedStocks.length < 4) {
      setSelectedStocks([...selectedStocks, symbol])
      setSearchTerm("")
    }
  }

  const removeStock = (symbol: string) => {
    setSelectedStocks(selectedStocks.filter((s) => s !== symbol))
  }

  const compareStocks = allStocks.filter((s) => selectedStocks.includes(s.symbol))

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <MarketTicker />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Compare Stocks</h1>
            <p className="text-muted-foreground">Compare up to 4 stocks side by side</p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Select Stocks to Compare</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedStocks.map((symbol) => (
                  <Badge key={symbol} variant="secondary" className="px-3 py-1.5">
                    {symbol}
                    <button onClick={() => removeStock(symbol)} className="ml-2 hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>

              {selectedStocks.length < 4 && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search stocks to add..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                  {searchTerm && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-10 max-h-48 overflow-auto">
                      {filteredStocks.map((stock) => (
                        <button
                          key={stock.symbol}
                          onClick={() => addStock(stock.symbol)}
                          className="w-full flex items-center justify-between p-3 hover:bg-muted/50 text-left"
                        >
                          <div>
                            <p className="font-medium">{stock.symbol}</p>
                            <p className="text-xs text-muted-foreground">{stock.name}</p>
                          </div>
                          <Plus className="h-4 w-4 text-muted-foreground" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {compareStocks.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-3 font-medium">Metric</th>
                        {compareStocks.map((stock) => (
                          <th key={stock.symbol} className="text-left p-3 font-medium">
                            {stock.symbol}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border">
                        <td className="p-3 text-muted-foreground">Price</td>
                        {compareStocks.map((stock) => (
                          <td key={stock.symbol} className="p-3 font-mono">
                            ₹{stock.price.toLocaleString("en-IN")}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-border">
                        <td className="p-3 text-muted-foreground">Change</td>
                        {compareStocks.map((stock) => (
                          <td key={stock.symbol} className="p-3">
                            <Badge
                              className={cn(
                                "font-mono",
                                stock.changePercent >= 0 ? "bg-chart-1/10 text-chart-1" : "bg-chart-2/10 text-chart-2",
                              )}
                            >
                              {stock.changePercent >= 0 ? (
                                <ArrowUpRight className="h-3 w-3 mr-1" />
                              ) : (
                                <ArrowDownRight className="h-3 w-3 mr-1" />
                              )}
                              {stock.changePercent.toFixed(2)}%
                            </Badge>
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-border">
                        <td className="p-3 text-muted-foreground">Volume</td>
                        {compareStocks.map((stock) => (
                          <td key={stock.symbol} className="p-3 font-mono">
                            {(stock.volume / 1000000).toFixed(2)}M
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-border">
                        <td className="p-3 text-muted-foreground">Market Cap</td>
                        {compareStocks.map((stock) => (
                          <td key={stock.symbol} className="p-3 font-mono">
                            ₹{(stock.marketCap / 1e12).toFixed(2)}T
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
