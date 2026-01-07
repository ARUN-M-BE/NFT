# 🚀 Gemini Crypto Exchange Dashboard

<div align="center">

![Gemini Dashboard](https://img.shields.io/badge/React-18.2-blue?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-5.0-purple?style=for-the-badge&logo=vite)
![Chakra UI](https://img.shields.io/badge/Chakra_UI-2.8-teal?style=for-the-badge&logo=chakra-ui)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**A premium, real-time cryptocurrency exchange dashboard built with modern web technologies**

[Live Demo](#) • [Documentation](#features) • [API Reference](#api-integration)

</div>

---

## ✨ Features

### 🎨 **Premium UI/UX**
- **Dual Theme Support**: Seamless light/dark mode toggle with persistent preferences
- **3D Spline Integration**: Stunning animated 3D backgrounds for immersive experience
- **Glassmorphism Design**: Modern glass-card effects with backdrop blur
- **Micro-interactions**: Smooth animations and transitions using Framer Motion
- **Responsive Design**: Mobile-first approach with breakpoints for all devices

### 📊 **Real-Time Market Data**
- **Live Price Updates**: Auto-refresh every 1 minute (60 seconds)
- **444+ Trading Pairs**: Complete market coverage from Gemini Exchange
- **Interactive Charts**: Area charts with multiple timeframes (1m, 5m, 15m, 30m, 1hr, 6hr, 1day)
- **Order Book**: Real-time bids and asks visualization
- **Trade History**: Recent trades with buy/sell indicators

### 🔧 **Advanced Features**
- **Smart Search**: Debounced search with instant filtering
- **Skeleton Loaders**: Elegant loading states for better UX
- **Refresh Indicator**: Visual countdown to next data update
- **Error Handling**: Comprehensive error management with user-friendly messages
- **Performance Optimized**: Code splitting and lazy loading

---

## 🛠️ Technology Stack

### **Core**
- **React 18.2** - Modern React with hooks and concurrent features
- **Vite 5.0** - Lightning-fast build tool and dev server
- **React Router 6.21** - Client-side routing

### **UI Libraries**
- **Chakra UI 2.8** - Component library with theme support
- **Ant Design 5.13** - Advanced data tables and components
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **Framer Motion 10.18** - Production-ready animation library
- **Spline** - 3D design and animation tool
- **Lucide React** - Beautiful, consistent icon library

### **Data Visualization**
- **Recharts 2.12** - Composable charting library
- **Lightweight Charts 4.1** - Professional trading charts

### **API & State**
- **Axios 1.6** - Promise-based HTTP client
- **Custom Hooks** - Reusable logic for API calls and polling

---

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Git

### Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/gemini-dashboard.git
cd gemini-dashboard

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The application will be available at `http://localhost:5173`

---

## 🎯 Project Structure

```
gemini-dashboard/
├── src/
│   ├── api/                    # API integration layer
│   │   ├── geminiClient.js     # Axios client with interceptors
│   │   ├── endpoints/          # API endpoint modules
│   │   └── index.js            # Centralized exports
│   ├── components/
│   │   ├── Common/             # Reusable components
│   │   │   ├── Card.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── PriceBadge.jsx
│   │   │   ├── RefreshIndicator.jsx
│   │   │   ├── SkeletonLoaders.jsx
│   │   │   └── SplineBackground.jsx
│   │   └── Layout/             # Layout components
│   │       ├── AppLayout.jsx
│   │       ├── Header.jsx
│   │       └── Sidebar.jsx
│   ├── pages/                  # Page components
│   │   ├── Dashboard.jsx
│   │   ├── Markets.jsx
│   │   ├── TradingPair.jsx
│   │   ├── FeePromosPage.jsx
│   │   ├── FundingPage.jsx
│   │   └── OrderBookPage.jsx
│   ├── hooks/                  # Custom React hooks
│   │   ├── useGeminiAPI.js     # API fetching hook
│   │   ├── useDebounce.js      # Debounce hook
│   │   └── useLocalStorage.js  # LocalStorage hook
│   ├── utils/                  # Utility functions
│   │   ├── constants.js        # App constants
│   │   └── formatters.js       # Number/date formatters
│   ├── styles/                 # Global styles
│   │   ├── global.css          # Tailwind + custom CSS
│   │   └── theme.js            # Chakra UI theme
│   ├── animations/             # Animation variants
│   │   └── variants.js         # Framer Motion variants
│   ├── App.jsx                 # Main app component
│   └── main.jsx                # Entry point
├── public/                     # Static assets
├── index.html                  # HTML template
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind configuration
├── postcss.config.js           # PostCSS configuration
└── package.json                # Dependencies
```

---

## 🔌 API Integration

### Gemini REST API Endpoints

All 14 Gemini market data endpoints are fully integrated:

| Endpoint | Method | Purpose | Refresh Rate |
|----------|--------|---------|--------------|
| `/v1/symbols` | GET | List all trading symbols | On demand |
| `/v1/symbols/details/:symbol` | GET | Get symbol details | On demand |
| `/v1/network/:symbol` | GET | Get network info | On demand |
| `/v1/pubticker/:symbol` | GET | Get ticker V1 | 1 minute |
| `/v2/ticker/:symbol` | GET | Get ticker V2 (recommended) | 1 minute |
| `/v1/feepromos` | GET | List fee promotions | On demand |
| `/v1/book/:symbol` | GET | Get order book | 1 minute |
| `/v1/trades/:symbol` | GET | List recent trades | 1 minute |
| `/v1/pricefeed` | GET | Get all prices | 1 minute |
| `/v1/fundingamount/:symbol` | GET | Get funding amount | On demand |
| `/v1/fundingamountreport` | GET | Get funding report | On demand |
| `/v2/candles/:symbol/:timeframe` | GET | Get OHLCV candles | 1 minute |
| `/v2/derivatives/candles/:symbol/:timeframe` | GET | Get derivative candles | On demand |
| `/v1/fxrate/:currency` | GET | Get FX rate | On demand |

### Auto-Refresh System

- **Interval**: All data refreshes every **60 seconds (1 minute)**
- **Visual Feedback**: Refresh indicator shows last update time and countdown
- **Manual Refresh**: Click refresh icon to update immediately
- **Error Handling**: Automatic retry on network failures

---

## 🎨 Theme System

### Light & Dark Mode

The application supports both light and dark themes with:
- **Persistent Preferences**: Theme choice saved to localStorage
- **Smooth Transitions**: Animated theme switching
- **Theme-Aware Components**: All components adapt to current theme
- **Semantic Tokens**: Consistent color system across themes

### Color Palette

**Dark Mode:**
- Background: `#0a0a0a` → `#1a1a2e` (gradient)
- Glass Cards: `rgba(255, 255, 255, 0.05)`
- Text: White / Gray 400

**Light Mode:**
- Background: `#f0f4f8` → `#e2e8f0` (gradient)
- Glass Cards: `rgba(255, 255, 255, 0.9)`
- Text: Gray 900 / Gray 600

---

## 🚀 Performance

- **Initial Load**: ~2.8 seconds (Vite compilation)
- **Page Navigation**: Instant (client-side routing)
- **API Response**: 200-500ms average
- **Bundle Size**: Optimized with code splitting
- **Animations**: 60fps smooth animations
- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices)

---

## 📱 Responsive Breakpoints

- **Mobile**: < 768px (Single column, collapsed sidebar)
- **Tablet**: 768px - 1024px (2-column grid)
- **Desktop**: > 1024px (3-4 column grid, visible sidebar)

---

## 🎓 Usage Examples

### Fetching Market Data

```javascript
import { usePolling } from '@/hooks/useGeminiAPI';
import { getAllPrices } from '@/api';
import { REFRESH_INTERVALS } from '@/utils/constants';

function MyComponent() {
  const { data, loading, error, lastUpdated, nextUpdate } = usePolling(
    getAllPrices,
    REFRESH_INTERVALS.PRICES
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return <PriceList prices={data} />;
}
```

### Using Theme

```javascript
import { useColorMode } from '@chakra-ui/react';

function ThemedComponent() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box bg={colorMode === 'dark' ? 'gray.900' : 'white'}>
      <Button onClick={toggleColorMode}>
        Toggle {colorMode === 'dark' ? 'Light' : 'Dark'} Mode
      </Button>
    </Box>
  );
}
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Gemini Exchange** for providing the public REST API
- **Chakra UI** team for the excellent component library
- **Spline** for 3D design tools
- **Vite** team for the blazing-fast build tool

---

## 📞 Support

For support, email support@example.com or open an issue on GitHub.

---

<div align="center">

**Built with ❤️ using React, Vite, Chakra UI, and modern web technologies**

⭐ Star this repo if you find it helpful!

</div>
