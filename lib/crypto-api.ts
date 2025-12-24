export interface CryptoPrice {
  id: string
  symbol: string
  name: string
  current_price: number
  price_change_percentage_24h: number
  market_cap: number
  total_volume: number
  image: string
  high_24h: number
  low_24h: number
  sparkline_in_7d?: { price: number[] }
}

export interface NFTCollection {
  id: string
  name: string
  symbol: string
  floor_price: number
  floor_price_change_24h: number
  volume_24h: number
  image: string
}

// Using CoinGecko free API for live crypto prices
export async function fetchCryptoPrices(): Promise<CryptoPrice[]> {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=true&price_change_percentage=24h",
      { next: { revalidate: 30 } },
    )
    if (!response.ok) throw new Error("Failed to fetch")
    return response.json()
  } catch {
    return getMockCryptoData()
  }
}

export async function fetchSingleCrypto(id: string): Promise<CryptoPrice | null> {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${id}&sparkline=true`,
      { next: { revalidate: 30 } },
    )
    if (!response.ok) throw new Error("Failed to fetch")
    const data = await response.json()
    return data[0] || null
  } catch {
    const mockData = getMockCryptoData()
    return mockData.find((c) => c.id === id) || null
  }
}

// Mock data as fallback
function getMockCryptoData(): CryptoPrice[] {
  return [
    {
      id: "bitcoin",
      symbol: "BTC",
      name: "Bitcoin",
      current_price: 98542.0,
      price_change_percentage_24h: 2.45,
      market_cap: 1940000000000,
      total_volume: 45000000000,
      image: "/bitcoin-logo.png",
      high_24h: 99200,
      low_24h: 96800,
      sparkline_in_7d: { price: generateSparkline(98542) },
    },
    {
      id: "ethereum",
      symbol: "ETH",
      name: "Ethereum",
      current_price: 3456.78,
      price_change_percentage_24h: -1.23,
      market_cap: 415000000000,
      total_volume: 18000000000,
      image: "/ethereum-logo.png",
      high_24h: 3520,
      low_24h: 3380,
      sparkline_in_7d: { price: generateSparkline(3456) },
    },
    {
      id: "binancecoin",
      symbol: "BNB",
      name: "BNB",
      current_price: 654.32,
      price_change_percentage_24h: 0.87,
      market_cap: 98000000000,
      total_volume: 1200000000,
      image: "/bnb-logo.png",
      high_24h: 665,
      low_24h: 645,
      sparkline_in_7d: { price: generateSparkline(654) },
    },
    {
      id: "solana",
      symbol: "SOL",
      name: "Solana",
      current_price: 198.45,
      price_change_percentage_24h: 5.67,
      market_cap: 92000000000,
      total_volume: 3500000000,
      image: "/solana-logo.png",
      high_24h: 205,
      low_24h: 188,
      sparkline_in_7d: { price: generateSparkline(198) },
    },
    {
      id: "ripple",
      symbol: "XRP",
      name: "XRP",
      current_price: 2.34,
      price_change_percentage_24h: -0.45,
      market_cap: 134000000000,
      total_volume: 8500000000,
      image: "/xrp-logo.jpg",
      high_24h: 2.42,
      low_24h: 2.28,
      sparkline_in_7d: { price: generateSparkline(2.34) },
    },
    {
      id: "cardano",
      symbol: "ADA",
      name: "Cardano",
      current_price: 1.12,
      price_change_percentage_24h: 3.21,
      market_cap: 39500000000,
      total_volume: 890000000,
      image: "/cardano-logo.jpg",
      high_24h: 1.15,
      low_24h: 1.08,
      sparkline_in_7d: { price: generateSparkline(1.12) },
    },
    {
      id: "dogecoin",
      symbol: "DOGE",
      name: "Dogecoin",
      current_price: 0.412,
      price_change_percentage_24h: 8.45,
      market_cap: 60500000000,
      total_volume: 4200000000,
      image: "/dogecoin-logo.png",
      high_24h: 0.425,
      low_24h: 0.38,
      sparkline_in_7d: { price: generateSparkline(0.412) },
    },
    {
      id: "polkadot",
      symbol: "DOT",
      name: "Polkadot",
      current_price: 9.87,
      price_change_percentage_24h: -2.34,
      market_cap: 14200000000,
      total_volume: 520000000,
      image: "/polkadot-logo.png",
      high_24h: 10.2,
      low_24h: 9.65,
      sparkline_in_7d: { price: generateSparkline(9.87) },
    },
    {
      id: "avalanche-2",
      symbol: "AVAX",
      name: "Avalanche",
      current_price: 45.67,
      price_change_percentage_24h: 1.89,
      market_cap: 18700000000,
      total_volume: 780000000,
      image: "/avalanche-logo-abstract.png",
      high_24h: 47.2,
      low_24h: 44.5,
      sparkline_in_7d: { price: generateSparkline(45.67) },
    },
    {
      id: "chainlink",
      symbol: "LINK",
      name: "Chainlink",
      current_price: 25.43,
      price_change_percentage_24h: 4.56,
      market_cap: 15800000000,
      total_volume: 1100000000,
      image: "/chainlink-logo.png",
      high_24h: 26.1,
      low_24h: 24.2,
      sparkline_in_7d: { price: generateSparkline(25.43) },
    },
    {
      id: "polygon",
      symbol: "MATIC",
      name: "Polygon",
      current_price: 0.658,
      price_change_percentage_24h: -1.12,
      market_cap: 6100000000,
      total_volume: 320000000,
      image: "/polygon-logo.png",
      high_24h: 0.68,
      low_24h: 0.64,
      sparkline_in_7d: { price: generateSparkline(0.658) },
    },
    {
      id: "uniswap",
      symbol: "UNI",
      name: "Uniswap",
      current_price: 14.23,
      price_change_percentage_24h: 2.78,
      market_cap: 10700000000,
      total_volume: 280000000,
      image: "/uniswap-logo.png",
      high_24h: 14.6,
      low_24h: 13.8,
      sparkline_in_7d: { price: generateSparkline(14.23) },
    },
  ]
}

function generateSparkline(basePrice: number): number[] {
  const prices = []
  for (let i = 0; i < 168; i++) {
    const variation = (Math.random() - 0.5) * 0.1 * basePrice
    prices.push(basePrice + variation)
  }
  return prices
}

// Mock NFT data
export function getMockNFTData(): NFTCollection[] {
  return [
    {
      id: "bored-ape",
      name: "Bored Ape Yacht Club",
      symbol: "BAYC",
      floor_price: 28.5,
      floor_price_change_24h: 2.3,
      volume_24h: 1250,
      image: "/abstract-ape-art.png",
    },
    {
      id: "crypto-punks",
      name: "CryptoPunks",
      symbol: "PUNK",
      floor_price: 45.2,
      floor_price_change_24h: -1.8,
      volume_24h: 890,
      image: "/abstract-nft-art.png",
    },
    {
      id: "mutant-ape",
      name: "Mutant Ape Yacht Club",
      symbol: "MAYC",
      floor_price: 5.8,
      floor_price_change_24h: 4.5,
      volume_24h: 520,
      image: "/mutant-ape-nft.jpg",
    },
    {
      id: "azuki",
      name: "Azuki",
      symbol: "AZUKI",
      floor_price: 8.2,
      floor_price_change_24h: -0.5,
      volume_24h: 380,
      image: "/nft-azuki.png",
    },
    {
      id: "pudgy-penguins",
      name: "Pudgy Penguins",
      symbol: "PPG",
      floor_price: 12.4,
      floor_price_change_24h: 6.7,
      volume_24h: 670,
      image: "/generic-penguin-collection.png",
    },
    {
      id: "doodles",
      name: "Doodles",
      symbol: "DOODLE",
      floor_price: 3.2,
      floor_price_change_24h: 1.2,
      volume_24h: 210,
      image: "/nft-doodle.png",
    },
  ]
}

// Mock stock data
export interface StockData {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: number
  marketCap: number
}

export function getMockStockData(): StockData[] {
  return [
    {
      symbol: "RELIANCE",
      name: "Reliance Industries",
      price: 2456.75,
      change: 23.45,
      changePercent: 0.96,
      volume: 8500000,
      marketCap: 16600000000000,
    },
    {
      symbol: "TCS",
      name: "Tata Consultancy Services",
      price: 4123.5,
      change: -45.2,
      changePercent: -1.08,
      volume: 2100000,
      marketCap: 14900000000000,
    },
    {
      symbol: "HDFCBANK",
      name: "HDFC Bank Ltd",
      price: 1678.9,
      change: 12.3,
      changePercent: 0.74,
      volume: 6200000,
      marketCap: 12700000000000,
    },
    {
      symbol: "INFY",
      name: "Infosys Ltd",
      price: 1856.4,
      change: 28.6,
      changePercent: 1.56,
      volume: 4800000,
      marketCap: 7700000000000,
    },
    {
      symbol: "ICICIBANK",
      name: "ICICI Bank Ltd",
      price: 1234.55,
      change: -8.9,
      changePercent: -0.72,
      volume: 5100000,
      marketCap: 8700000000000,
    },
    {
      symbol: "BHARTIARTL",
      name: "Bharti Airtel Ltd",
      price: 1567.8,
      change: 34.5,
      changePercent: 2.25,
      volume: 3200000,
      marketCap: 9400000000000,
    },
    {
      symbol: "BAJFINANCE",
      name: "Bajaj Finance Ltd",
      price: 7234.2,
      change: -56.8,
      changePercent: -0.78,
      volume: 1800000,
      marketCap: 4500000000000,
    },
    {
      symbol: "HINDUNILVR",
      name: "Hindustan Unilever",
      price: 2567.9,
      change: 18.4,
      changePercent: 0.72,
      volume: 2400000,
      marketCap: 6000000000000,
    },
  ]
}

export interface IndexData {
  name: string
  value: number
  change: number
  changePercent: number
}

export function getMockIndexData(): IndexData[] {
  return [
    { name: "Nifty 50", value: 25709.85, change: 125.4, changePercent: 0.49 },
    { name: "Bank Nifty", value: 57713.35, change: -234.5, changePercent: -0.41 },
    { name: "FIN NIFTY", value: 27538.6, change: 89.2, changePercent: 0.32 },
    { name: "Sensex", value: 83952.19, change: 312.45, changePercent: 0.37 },
    { name: "MIDCPNIFTY", value: 13160.8, change: -45.3, changePercent: -0.34 },
  ]
}
