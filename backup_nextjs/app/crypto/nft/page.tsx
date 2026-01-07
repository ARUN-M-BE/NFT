import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getMockNFTData } from "@/lib/crypto-api"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"

export default function NFTPage() {
  const nfts = getMockNFTData()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">NFT Collections</h1>
            <p className="text-muted-foreground">Track floor prices, volume, and trends of top NFT collections.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {nfts.map((nft) => (
              <Card key={nft.id} className="overflow-hidden hover:border-primary/50 transition-colors">
                <Link href={`/crypto/nft/${nft.id}`}>
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-4">
                      <Image
                        src={nft.image || "/placeholder.svg"}
                        alt={nft.name}
                        width={64}
                        height={64}
                        className="rounded-xl"
                      />
                      <div>
                        <CardTitle className="text-lg">{nft.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{nft.symbol}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Floor Price</p>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-semibold">{nft.floor_price} ETH</span>
                          <Badge
                            variant="secondary"
                            className={cn(
                              "font-mono text-xs",
                              nft.floor_price_change_24h >= 0
                                ? "bg-chart-1/10 text-chart-1"
                                : "bg-chart-2/10 text-chart-2",
                            )}
                          >
                            {nft.floor_price_change_24h >= 0 ? (
                              <ArrowUpRight className="h-3 w-3" />
                            ) : (
                              <ArrowDownRight className="h-3 w-3" />
                            )}
                            {Math.abs(nft.floor_price_change_24h).toFixed(1)}%
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">24h Volume</p>
                        <span className="font-mono font-semibold">{nft.volume_24h.toLocaleString()} ETH</span>
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
