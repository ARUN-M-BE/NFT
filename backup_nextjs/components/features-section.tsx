import { Card, CardContent } from "@/components/ui/card"
import { Filter, Save, Share2, LineChart, BarChart3, Zap } from "lucide-react"

const features = [
  {
    icon: Filter,
    title: "200+ Filters",
    description: "Built to help you identify desired stocks quickly based on your criteria.",
  },
  {
    icon: Zap,
    title: "Advanced Mode",
    description: "Customise filters with comparison operator for insightful screener results.",
  },
  {
    icon: Share2,
    title: "Save & Share",
    description: "Let the world know what you are building. Save your screener & share in community.",
  },
  {
    icon: LineChart,
    title: "Analyse & Execute",
    description: "Single platform for stock market analysis, execution & management of trades.",
  },
]

const benefits = [
  {
    icon: BarChart3,
    title: "High Value Insights",
    description: "Take your analysis to the next level with actionable insights from ScanX.",
  },
  {
    icon: Filter,
    title: "Readymade Screeners",
    description: "All stocks screeners. For all important criteria. Pre-set and ready to use.",
  },
  {
    icon: Save,
    title: "Custom Screeners",
    description: "Define the criteria. Save the screener. Use it whenever you want!",
  },
  {
    icon: LineChart,
    title: "Compare Stocks",
    description: "Know the stock completely in & out with fundamentals, financials and technicals.",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Create Your Custom Screens</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">ScanX helps you create and save your own screeners!</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-16">
          {features.map((feature) => (
            <Card key={feature.title} className="bg-card/50 backdrop-blur">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-balance">You Deserve The Best Screener For Indian Stocks</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => (
            <Card key={benefit.title} className="text-center">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                  <benefit.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
