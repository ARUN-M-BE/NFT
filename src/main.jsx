import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { ConfigProvider } from 'antd';
import App from './App';
import theme from './styles/theme';
import './styles/global.css';
import { AuthProvider } from './context/AuthContext';
import { PortfolioProvider } from './context/PortfolioContext';
import { WatchlistProvider } from './context/WatchlistContext';
import { AlertsProvider } from './context/AlertsContext';
import { SimulatorProvider } from './context/SimulatorContext';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter
            future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
            }}
        >
            <ColorModeScript initialColorMode={theme.config.initialColorMode} />
            <ChakraProvider theme={theme}>
                <ConfigProvider
                    theme={{
                        token: {
                            colorPrimary: '#1890ff',
                            borderRadius: 8,
                        },
                    }}
                >
                    <AuthProvider>
                        <PortfolioProvider>
                            <WatchlistProvider>
                                <AlertsProvider>
                                    <SimulatorProvider>
                                        <App />
                                    </SimulatorProvider>
                                </AlertsProvider>
                            </WatchlistProvider>
                        </PortfolioProvider>
                    </AuthProvider>
                </ConfigProvider>
            </ChakraProvider>
        </BrowserRouter>
    </React.StrictMode>
);
