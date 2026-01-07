import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const trendingStocks = [
  { name: "Infosys", href: "/company/infosys" },
  { name: "TCS", href: "/company/tcs" },
  { name: "HDFC Bank", href: "/company/hdfc-bank" },
  { name: "Reliance Industries", href: "/company/reliance" },
  { name: "HUL", href: "/company/hul" },
  { name: "Bharti Airtel", href: "/company/bharti-airtel" },
  { name: "Bajaj Finance", href: "/company/bajaj-finance" },
]

export function HeroSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 text-center">
        <Badge variant="secondary" className="mb-4">
          Stock Screener & Crypto Market Platform
        </Badge>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">
          Stock Screener for Indian Stocks & Live Crypto
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 text-pretty">
          Get high-value insights for your analysis with our ScanX stock market screener and live cryptocurrency prices
          like Binance.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {trendingStocks.map((stock) => (
            <Link key={stock.name} href={stock.href}>
              <Badge
                variant="outline"
                className="hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
              >
                {stock.name}
              </Badge>
            </Link>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" asChild>
            <Link href="/screener">Explore Screeners</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/crypto">View Crypto Prices</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
