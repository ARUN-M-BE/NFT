import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/Layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { Markets } from './pages/Markets';
import { TradingPair } from './pages/TradingPair';
import { OrderBookPage } from './pages/OrderBookPage';
import { FeePromosPage } from './pages/FeePromosPage';
import { FundingPage } from './pages/FundingPage';
import './styles/global.css';

function App() {
    return (
        <Router>
            <AppLayout>
                <Routes>
                    <Route path='/' element={<Dashboard />} />
                    <Route path='/markets' element={<Markets />} />
                    <Route path='/trading' element={<TradingPair />} />
                    <Route path='/trading/:symbol' element={<TradingPair />} />
                    <Route path='/orderbook' element={<OrderBookPage />} />
                    <Route path='/fee-promos' element={<FeePromosPage />} />
                    <Route path='/funding' element={<FundingPage />} />
                </Routes>
            </AppLayout>
        </Router>
    );
}

export default App;
