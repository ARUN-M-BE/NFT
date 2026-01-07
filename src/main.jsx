import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { ConfigProvider, theme as antdTheme } from 'antd';
import App from './App';
import customTheme from './styles/theme';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ColorModeScript initialColorMode={customTheme.config.initialColorMode} />
        <ChakraProvider theme={customTheme}>
            <ConfigProvider
                theme={{
                    algorithm: antdTheme.darkAlgorithm,
                    token: {
                        colorPrimary: '#1890ff',
                        borderRadius: 8,
                    },
                }}
            >
                <App />
            </ConfigProvider>
        </ChakraProvider>
    </React.StrictMode>
);
