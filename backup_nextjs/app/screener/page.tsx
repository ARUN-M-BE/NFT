import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MarketTicker } from "@/components/market-ticker"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { TrendingUp, BarChart3, Activity, Layers, Settings2, ChevronRight } from "lucide-react"

const screenerCategories = [
  {
    title: "Intraday Screeners",
    icon: Activity,
    description: "Real-time screeners for intraday trading opportunities",
    items: [
      { name: "Crossover Stocks", href: "/screener/intraday/crossover" },
      { name: "Supertrend Stocks", href: "/screener/intraday/supertrend" },
      { name: "Rise & Fall Stocks", href: "/screener/intraday/rise-fall" },
      { name: "Recovery Stocks", href: "/screener/intraday/recovery" },
      { name: "Open High Stocks", href: "/screener/intraday/open-high" },
      { name: "Open Low Stocks", href: "/screener/intraday/open-low" },
    ],
  },
  {
    title: "Fundamental Screeners",
    icon: BarChart3,
    description: "Screen stocks based on fundamental analysis metrics",
    items: [
      { name: "High PE Ratio", href: "/screener/fundamentals/high-pe" },
      { name: "Low PE Ratio", href: "/screener/fundamentals/low-pe" },
      { name: "High Dividend Yield", href: "/screener/fundamentals/high-dividend" },
      { name: "High ROE", href: "/screener/fundamentals/high-roe" },
      { name: "Low Debt to Equity", href: "/screener/fundamentals/low-debt" },
      { name: "High Promoter Holding", href: "/screener/fundamentals/high-promoter" },
    ],
  },
  {
    title: "Technical Screeners",
    icon: TrendingUp,
    description: "Technical analysis based stock screening",
    items: [
      { name: "RSI Oversold", href: "/screener/technical/rsi-oversold" },
      { name: "RSI Overbought", href: "/screener/technical/rsi-overbought" },
      { name: "MACD Bullish Crossover", href: "/screener/technical/macd-bullish" },
      { name: "MACD Bearish Crossover", href: "/screener/technical/macd-bearish" },
      { name: "Above 200 DMA", href: "/screener/technical/above-200dma" },
      { name: "Below 50 DMA", href: "/screener/technical/below-50dma" },
    ],
  },
  {
    title: "Price & Volume",
    icon: Layers,
    description: "Screen by price action and volume patterns",
    items: [
      { name: "52 Week High", href: "/screener/price/52-week-high" },
      { name: "52 Week Low", href: "/screener/price/52-week-low" },
      { name: "Volume Breakout", href: "/screener/volume/breakout" },
      { name: "Price Breakout", href: "/screener/price/breakout" },
      { name: "High Volume", href: "/screener/volume/high" },
      { name: "Low Volume", href: "/screener/volume/low" },
    ],
  },
]

export default function ScreenerPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <MarketTicker />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Stock Screeners</h1>
              <p className="text-muted-foreground">50+ readymade screeners to find your next trade</p>
            </div>
            <Button asChild>
              <Link href="/screener/custom">
                <Settings2 className="mr-2 h-4 w-4" />
                Create Custom Screener
              </Link>
            </Button>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {screenerCategories.map((category) => (
              <Card key={category.title}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <category.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold">{category.title}</h2>
                      <p className="text-sm font-normal text-muted-foreground">{category.description}</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {category.items.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 hover:border-primary/50 transition-all group"
                      >
                        <span className="text-sm font-medium">{item.name}</span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
