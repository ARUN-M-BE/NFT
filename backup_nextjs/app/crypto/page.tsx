import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { LiveCryptoTicker } from "@/components/live-crypto-ticker"
import { CryptoTable } from "@/components/crypto-table"
import { NFTGrid } from "@/components/nft-grid"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CryptoPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <LiveCryptoTicker />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Cryptocurrency Prices by Market Cap</h1>
            <p className="text-muted-foreground">
              Live cryptocurrency prices, market cap, volume, and more. Updated every 30 seconds.
            </p>
          </div>

          <Tabs defaultValue="all" className="space-y-6">
            <TabsList>
              <TabsTrigger value="all">All Cryptocurrencies</TabsTrigger>
              <TabsTrigger value="defi">DeFi</TabsTrigger>
              <TabsTrigger value="nft">NFTs</TabsTrigger>
              <TabsTrigger value="metaverse">Metaverse</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-6">
              <CryptoTable limit={50} />
            </TabsContent>

            <TabsContent value="defi" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>DeFi Tokens</CardTitle>
                </CardHeader>
                <CardContent>
                  <CryptoTable limit={20} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="nft" className="space-y-6">
              <NFTGrid />
            </TabsContent>

            <TabsContent value="metaverse" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Metaverse Tokens</CardTitle>
                </CardHeader>
                <CardContent>
                  <CryptoTable limit={20} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}
