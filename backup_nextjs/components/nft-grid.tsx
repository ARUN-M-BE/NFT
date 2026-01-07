"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { getMockNFTData, type NFTCollection } from "@/lib/crypto-api"

export function NFTGrid() {
  const nfts = getMockNFTData()

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Trending NFT Collections</CardTitle>
        <Button variant="outline" size="sm" asChild>
          <Link href="/crypto/nft">View All</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {nfts.map((nft) => (
            <NFTCard key={nft.id} nft={nft} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function NFTCard({ nft }: { nft: NFTCollection }) {
  return (
    <Link
      href={`/crypto/nft/${nft.id}`}
      className="group flex items-center gap-4 p-4 rounded-xl border border-border hover:bg-muted/50 transition-all hover:border-primary/50"
    >
      <Image src={nft.image || "/placeholder.svg"} alt={nft.name} width={56} height={56} className="rounded-xl" />
      <div className="flex-1 min-w-0">
        <p className="font-semibold truncate group-hover:text-primary transition-colors">{nft.name}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm text-muted-foreground">Floor:</span>
          <span className="font-mono text-sm">{nft.floor_price} ETH</span>
          <Badge
            variant="secondary"
            className={cn(
              "font-mono text-xs",
              nft.floor_price_change_24h >= 0 ? "bg-chart-1/10 text-chart-1" : "bg-chart-2/10 text-chart-2",
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
        <p className="text-xs text-muted-foreground mt-1">Vol: {nft.volume_24h.toLocaleString()} ETH</p>
      </div>
    </Link>
  )
}
