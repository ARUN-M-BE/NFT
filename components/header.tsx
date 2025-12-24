"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ChevronDown, Menu, Moon, Sun, TrendingUp } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

const navigation = [
  {
    name: "Screener",
    href: "/screener",
    children: [
      { name: "All Screeners", href: "/screener" },
      { name: "Intraday Screener", href: "/screener/intraday" },
      { name: "Fundamentals", href: "/screener/fundamentals" },
      { name: "Technical", href: "/screener/technical" },
      { name: "Custom Screener", href: "/screener/custom" },
    ],
  },
  {
    name: "Live Market",
    href: "/live-market",
    children: [
      { name: "Bullish Signals", href: "/live-market/bullish" },
      { name: "Bearish Signals", href: "/live-market/bearish" },
      { name: "Near High", href: "/live-market/near-high" },
      { name: "Near Low", href: "/live-market/near-low" },
    ],
  },
  {
    name: "Crypto",
    href: "/crypto",
    children: [
      { name: "All Cryptocurrencies", href: "/crypto" },
      { name: "Trending", href: "/crypto/trending" },
      { name: "NFT Collections", href: "/crypto/nft" },
      { name: "DeFi Tokens", href: "/crypto/defi" },
    ],
  },
  { name: "Compare", href: "/compare" },
  { name: "Insights", href: "/insights" },
]

export function Header() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <TrendingUp className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">ScanX</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navigation.map((item) =>
              item.children ? (
                <DropdownMenu key={item.name}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className={cn("gap-1", pathname.startsWith(item.href) && "bg-muted")}>
                      {item.name}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48">
                    {item.children.map((child) => (
                      <DropdownMenuItem key={child.name} asChild>
                        <Link href={child.href}>{child.name}</Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button key={item.name} variant="ghost" asChild className={cn(pathname === item.href && "bg-muted")}>
                  <Link href={item.href}>{item.name}</Link>
                </Button>
              ),
            )}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          <div className="hidden sm:flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Sign Up</Link>
            </Button>
          </div>

          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <nav className="flex flex-col gap-4 mt-8">
                {navigation.map((item) => (
                  <div key={item.name}>
                    <Link href={item.href} className="font-medium text-foreground hover:text-primary">
                      {item.name}
                    </Link>
                    {item.children && (
                      <div className="ml-4 mt-2 flex flex-col gap-2">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            className="text-sm text-muted-foreground hover:text-foreground"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <div className="flex flex-col gap-2 mt-4 pt-4 border-t">
                  <Button variant="outline" asChild>
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/register">Sign Up</Link>
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
