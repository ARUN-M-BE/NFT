import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MarketTicker } from "@/components/market-ticker"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, BarChart3, Clock } from "lucide-react"
import Link from "next/link"

const insights = [
  {
    title: "Nifty 50 breaks 25,700 resistance",
    summary:
      "The benchmark index has crossed a key resistance level, signaling potential upward momentum in the short term.",
    category: "Market Update",
    time: "2 hours ago",
    trend: "bullish",
  },
  {
    title: "IT stocks under pressure amid global concerns",
    summary: "Tech stocks face selling pressure as global markets react to interest rate uncertainties.",
    category: "Sector Analysis",
    time: "4 hours ago",
    trend: "bearish",
  },
  {
    title: "Banking sector shows resilience",
    summary: "Bank Nifty holds steady despite market volatility, supported by strong Q3 earnings expectations.",
    category: "Sector Analysis",
    time: "6 hours ago",
    trend: "bullish",
  },
  {
    title: "FII inflows continue for 5th consecutive session",
    summary: "Foreign institutional investors maintain buying streak, injecting Rs 2,500 crore in equities.",
    category: "Fund Flows",
    time: "8 hours ago",
    trend: "bullish",
  },
  {
    title: "Crude oil prices impact auto stocks",
    summary: "Rising crude prices put pressure on automobile and logistics companies.",
    category: "Commodities",
    time: "10 hours ago",
    trend: "bearish",
  },
]

const marketStats = [
  { label: "Advancing", value: 1842, trend: "up" },
  { label: "Declining", value: 1156, trend: "down" },
  { label: "Unchanged", value: 124, trend: "neutral" },
]

export default function InsightsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <MarketTicker />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Market Insights</h1>
            <p className="text-muted-foreground">Trends, drivers, and analytics in real time</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              {insights.map((insight, index) => (
                <Card key={index} className="hover:border-primary/50 transition-colors">
                  <Link href="#">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary">{insight.category}</Badge>
                            {insight.trend === "bullish" ? (
                              <TrendingUp className="h-4 w-4 text-chart-1" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-chart-2" />
                            )}
                          </div>
                          <h3 className="font-semibold mb-2">{insight.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{insight.summary}</p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {insight.time}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Market Breadth
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {marketStats.map((stat) => (
                    <div key={stat.label} className="flex items-center justify-between">
                      <span className="text-muted-foreground">{stat.label}</span>
                      <span
                        className={
                          stat.trend === "up"
                            ? "text-chart-1 font-semibold"
                            : stat.trend === "down"
                              ? "text-chart-2 font-semibold"
                              : "font-semibold"
                        }
                      >
                        {stat.value}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link
                    href="/screener"
                    className="block p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    Stock Screeners
                  </Link>
                  <Link
                    href="/live-market"
                    className="block p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    Live Market Scanner
                  </Link>
                  <Link
                    href="/crypto"
                    className="block p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    Crypto Prices
                  </Link>
                  <Link
                    href="/compare"
                    className="block p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    Compare Stocks
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
