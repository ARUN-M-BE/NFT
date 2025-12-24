import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MarketTicker } from "@/components/market-ticker"
import { LiveCryptoTicker } from "@/components/live-crypto-ticker"
import { HeroSection } from "@/components/hero-section"
import { MarketScanner } from "@/components/market-scanner"
import { ScreenerTabs } from "@/components/screener-tabs"
import { CryptoTable } from "@/components/crypto-table"
import { NFTGrid } from "@/components/nft-grid"
import { FeaturesSection } from "@/components/features-section"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <MarketTicker />
      <LiveCryptoTicker />

      <main className="flex-1">
        <HeroSection />
        <MarketScanner />
        <ScreenerTabs />

        <section className="py-12">
          <div className="container mx-auto px-4 space-y-8">
            <CryptoTable limit={10} />
            <NFTGrid />
          </div>
        </section>

        <FeaturesSection />
      </main>

      <Footer />
    </div>
  )
}
