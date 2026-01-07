import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
    config: {
        initialColorMode: 'dark',
        useSystemColorMode: false,
    },
    fonts: {
        heading: `'Inter', sans-serif`,
        body: `'Inter', sans-serif`,
        mono: `'Roboto Mono', monospace`,
    },
    colors: {
        brand: {
            50: '#e6f7ff',
            100: '#bae7ff',
            200: '#91d5ff',
            300: '#69c0ff',
            400: '#40a9ff',
            500: '#1890ff',
            600: '#096dd9',
            700: '#0050b3',
            800: '#003a8c',
            900: '#002766',
        },
        success: {
            50: '#f6ffed',
            100: '#d9f7be',
            200: '#b7eb8f',
            300: '#95de64',
            400: '#73d13d',
            500: '#52c41a',
            600: '#389e0d',
            700: '#237804',
            800: '#135200',
            900: '#092b00',
        },
        danger: {
            50: '#fff1f0',
            100: '#ffccc7',
            200: '#ffa39e',
            300: '#ff7875',
            400: '#ff4d4f',
            500: '#f5222d',
            600: '#cf1322',
            700: '#a8071a',
            800: '#820014',
            900: '#5c0011',
        },
    },
    styles: {
        global: (props) => ({
            body: {
                bg: props.colorMode === 'dark' ? 'gray.950' : 'gray.50',
                color: props.colorMode === 'dark' ? 'white' : 'gray.900',
            },
        }),
    },
    components: {
        Button: {
            baseStyle: {
                fontWeight: 'semibold',
                borderRadius: 'lg',
            },
            variants: {
                solid: (props) => ({
                    bg: 'brand.500',
                    color: 'white',
                    _hover: {
                        bg: 'brand.600',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(24, 144, 255, 0.4)',
                    },
                    transition: 'all 0.3s ease',
                }),
                ghost: (props) => ({
                    _hover: {
                        bg: props.colorMode === 'dark' ? 'whiteAlpha.200' : 'blackAlpha.100',
                    },
                }),
            },
        },
        Card: {
            baseStyle: (props) => ({
                container: {
                    bg: props.colorMode === 'dark' ? 'whiteAlpha.50' : 'white',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 'xl',
                    border: '1px solid',
                    borderColor: props.colorMode === 'dark' ? 'whiteAlpha.100' : 'gray.200',
                    boxShadow: props.colorMode === 'dark' ? 'none' : 'sm',
                },
            }),
        },
    },
    semanticTokens: {
        colors: {
            'glass-bg': {
                default: 'whiteAlpha.900',
                _dark: 'whiteAlpha.50',
            },
            'glass-border': {
                default: 'gray.200',
                _dark: 'whiteAlpha.100',
            },
            'text-primary': {
                default: 'gray.900',
                _dark: 'white',
            },
            'text-secondary': {
                default: 'gray.600',
                _dark: 'gray.400',
            },
            'bg-primary': {
                default: 'white',
                _dark: 'gray.950',
            },
            'bg-secondary': {
                default: 'gray.50',
                _dark: 'gray.900',
            },
        },
    },
});

export default theme;
