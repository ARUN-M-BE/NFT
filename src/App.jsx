import { Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/Layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { Markets } from './pages/Markets';
import { TradingPair } from './pages/TradingPair';
import { OrderBookPage } from './pages/OrderBookPage';
import { FeePromosPage } from './pages/FeePromosPage';
import { FundingPage } from './pages/FundingPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { WatchlistPage } from './pages/WatchlistPage';
import { AlertsPage } from './pages/AlertsPage';
import { SimulatorPage } from './pages/SimulatorPage';

function App() {
    return (
        <AppLayout>
            <Routes>
                <Route path='/' element={<Dashboard />} />
                <Route path='/markets' element={<Markets />} />
                <Route path='/trading/:symbol?' element={<TradingPair />} />
                <Route path='/orderbook' element={<OrderBookPage />} />
                <Route path='/funding' element={<FundingPage />} />
                <Route path='/fee-promos' element={<FeePromosPage />} />
                <Route path='/portfolio' element={<PortfolioPage />} />
                <Route path='/watchlist' element={<WatchlistPage />} />
                <Route path='/alerts' element={<AlertsPage />} />
                <Route path='/simulator' element={<SimulatorPage />} />
            </Routes>
        </AppLayout>
    );
}

export default App;
