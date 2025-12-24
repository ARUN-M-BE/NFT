"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronRight } from "lucide-react"

const screenerCategories = {
  intraday: [
    { name: "Intraday Crossover", href: "/screener/intraday/crossover" },
    { name: "Intraday Supertrend", href: "/screener/intraday/supertrend" },
    { name: "Intraday Rise & Fall", href: "/screener/intraday/rise-fall" },
    { name: "Intraday Recovery", href: "/screener/intraday/recovery" },
    { name: "Open High Stocks", href: "/screener/intraday/open-high" },
    { name: "Open Low Stocks", href: "/screener/intraday/open-low" },
  ],
  fundamentals: [
    { name: "High PE Ratio", href: "/screener/fundamentals/high-pe" },
    { name: "Low PE Ratio", href: "/screener/fundamentals/low-pe" },
    { name: "High Dividend Yield", href: "/screener/fundamentals/high-dividend" },
    { name: "High ROE", href: "/screener/fundamentals/high-roe" },
    { name: "Low Debt to Equity", href: "/screener/fundamentals/low-debt" },
    { name: "High Promoter Holding", href: "/screener/fundamentals/high-promoter" },
  ],
  technical: [
    { name: "RSI Oversold", href: "/screener/technical/rsi-oversold" },
    { name: "RSI Overbought", href: "/screener/technical/rsi-overbought" },
    { name: "MACD Bullish Crossover", href: "/screener/technical/macd-bullish" },
    { name: "MACD Bearish Crossover", href: "/screener/technical/macd-bearish" },
    { name: "Above 200 DMA", href: "/screener/technical/above-200dma" },
    { name: "Below 50 DMA", href: "/screener/technical/below-50dma" },
  ],
  priceVolume: [
    { name: "52 Week High", href: "/screener/price/52-week-high" },
    { name: "52 Week Low", href: "/screener/price/52-week-low" },
    { name: "Volume Breakout", href: "/screener/volume/breakout" },
    { name: "Price Breakout", href: "/screener/price/breakout" },
    { name: "High Volume", href: "/screener/volume/high" },
    { name: "Low Volume", href: "/screener/volume/low" },
  ],
  candlestick: [
    { name: "Bullish Engulfing", href: "/screener/candlestick/bullish-engulfing" },
    { name: "Bearish Engulfing", href: "/screener/candlestick/bearish-engulfing" },
    { name: "Morning Star", href: "/screener/candlestick/morning-star" },
    { name: "Evening Star", href: "/screener/candlestick/evening-star" },
    { name: "Doji", href: "/screener/candlestick/doji" },
    { name: "Hammer", href: "/screener/candlestick/hammer" },
  ],
}

export function ScreenerTabs() {
  const [activeTab, setActiveTab] = useState("intraday")

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle>Trending Screeners</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="flex-wrap h-auto gap-2 bg-transparent p-0 mb-6">
                <TabsTrigger
                  value="intraday"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Real-Time Intraday
                </TabsTrigger>
                <TabsTrigger
                  value="fundamentals"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Fundamentals
                </TabsTrigger>
                <TabsTrigger
                  value="technical"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Technical
                </TabsTrigger>
                <TabsTrigger
                  value="priceVolume"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Price & Volume
                </TabsTrigger>
                <TabsTrigger
                  value="candlestick"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Candlestick
                </TabsTrigger>
              </TabsList>

              {Object.entries(screenerCategories).map(([key, items]) => (
                <TabsContent key={key} value={key} className="mt-0">
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 hover:border-primary/50 transition-all group"
                      >
                        <span className="font-medium">{item.name}</span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </Link>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>

            <div className="mt-6 pt-6 border-t border-border text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Find trending scrips with 50+ readymade stock market screeners!
              </p>
              <Button asChild>
                <Link href="/screener">Explore More</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
