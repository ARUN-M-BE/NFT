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
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';
import { AdminRoute } from './components/Auth/AdminRoute';
import { AdminDashboard } from './pages/AdminDashboard';
import { UserProfile } from './pages/UserProfile';
import { AdminUserData } from './pages/AdminUserData';

function App() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />

            {/* Protected Routes */}
            <Route path='/' element={
                <ProtectedRoute>
                    <AppLayout />
                </ProtectedRoute>
            }>
                <Route index element={<Dashboard />} />
                <Route path='markets' element={<Markets />} />
                <Route path='trading/:symbol?' element={<TradingPair />} />
                <Route path='orderbook' element={<OrderBookPage />} />
                <Route path='funding' element={<FundingPage />} />
                <Route path='fee-promos' element={<FeePromosPage />} />
                <Route path='portfolio' element={<PortfolioPage />} />
                <Route path='watchlist' element={<WatchlistPage />} />
                <Route path='alerts' element={<AlertsPage />} />
                <Route path='simulator' element={<SimulatorPage />} />
                <Route path='profile' element={<UserProfile />} />

                {/* Admin Routes */}
                <Route path='admin' element={
                    <AdminRoute>
                        <AdminDashboard />
                    </AdminRoute>
                } />
                <Route path='admin/users' element={
                    <AdminRoute>
                        <AdminUserData />
                    </AdminRoute>
                } />
            </Route>
        </Routes>
    );
}

export default App;
