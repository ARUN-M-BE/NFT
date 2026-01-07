import { extendTheme } from '@chakra-ui/react';

const config = {
    initialColorMode: 'dark',
    useSystemColorMode: false,
};

// Custom color palette
const colors = {
    brand: {
        50: '#e3f2fd',
        100: '#bbdefb',
        200: '#90caf9',
        300: '#64b5f6',
        400: '#42a5f5',
        500: '#2196f3',
        600: '#1e88e5',
        700: '#1976d2',
        800: '#1565c0',
        900: '#0d47a1',
    },
    success: {
        50: '#e8f5e9',
        100: '#c8e6c9',
        200: '#a5d6a7',
        300: '#81c784',
        400: '#66bb6a',
        500: '#4caf50',
        600: '#43a047',
        700: '#388e3c',
        800: '#2e7d32',
        900: '#1b5e20',
    },
    danger: {
        50: '#ffebee',
        100: '#ffcdd2',
        200: '#ef9a9a',
        300: '#e57373',
        400: '#ef5350',
        500: '#f44336',
        600: '#e53935',
        700: '#d32f2f',
        800: '#c62828',
        900: '#b71c1c',
    },
    warning: {
        50: '#fff8e1',
        100: '#ffecb3',
        200: '#ffe082',
        300: '#ffd54f',
        400: '#ffca28',
        500: '#ffc107',
        600: '#ffb300',
        700: '#ffa000',
        800: '#ff8f00',
        900: '#ff6f00',
    },
    // Dark mode colors
    dark: {
        bg: {
            primary: '#000000',
            secondary: '#0a0a0a',
            tertiary: '#141414',
            card: '#1a1a1a',
            hover: '#242424',
        },
        text: {
            primary: '#ffffff',
            secondary: '#b0b0b0',
            tertiary: '#808080',
            muted: '#606060',
        },
        border: {
            primary: '#2a2a2a',
            secondary: '#3a3a3a',
            accent: '#4a4a4a',
        },
    },
    // Light mode colors
    light: {
        bg: {
            primary: '#ffffff',
            secondary: '#f8f9fa',
            tertiary: '#f1f3f5',
            card: '#ffffff',
            hover: '#e9ecef',
        },
        text: {
            primary: '#1a1a1a',
            secondary: '#495057',
            tertiary: '#6c757d',
            muted: '#adb5bd',
        },
        border: {
            primary: '#dee2e6',
            secondary: '#ced4da',
            accent: '#adb5bd',
        },
    },
};

// Semantic tokens for easy theme switching
const semanticTokens = {
    colors: {
        // Background colors
        'bg-primary': {
            default: 'light.bg.primary',
            _dark: 'dark.bg.primary',
        },
        'bg-secondary': {
            default: 'light.bg.secondary',
            _dark: 'dark.bg.secondary',
        },
        'bg-tertiary': {
            default: 'light.bg.tertiary',
            _dark: 'dark.bg.tertiary',
        },
        'bg-card': {
            default: 'light.bg.card',
            _dark: 'dark.bg.card',
        },
        'bg-hover': {
            default: 'light.bg.hover',
            _dark: 'dark.bg.hover',
        },
        // Text colors
        'text-primary': {
            default: 'light.text.primary',
            _dark: 'dark.text.primary',
        },
        'text-secondary': {
            default: 'light.text.secondary',
            _dark: 'dark.text.secondary',
        },
        'text-tertiary': {
            default: 'light.text.tertiary',
            _dark: 'dark.text.tertiary',
        },
        'text-muted': {
            default: 'light.text.muted',
            _dark: 'dark.text.muted',
        },
        // Border colors
        'border-primary': {
            default: 'light.border.primary',
            _dark: 'dark.border.primary',
        },
        'border-secondary': {
            default: 'light.border.secondary',
            _dark: 'dark.border.secondary',
        },
        'border-accent': {
            default: 'light.border.accent',
            _dark: 'dark.border.accent',
        },
        // Glass effect
        'glass-bg': {
            default: 'rgba(255, 255, 255, 0.95)',
            _dark: 'rgba(26, 26, 26, 0.8)',
        },
        'glass-border': {
            default: 'rgba(0, 0, 0, 0.1)',
            _dark: 'rgba(255, 255, 255, 0.1)',
        },
    },
};

const styles = {
    global: (props) => ({
        body: {
            bg: props.colorMode === 'dark' ? 'dark.bg.primary' : 'light.bg.primary',
            color: props.colorMode === 'dark' ? 'dark.text.primary' : 'light.text.primary',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            lineHeight: '1.6',
        },
        '*::placeholder': {
            color: props.colorMode === 'dark' ? 'dark.text.muted' : 'light.text.muted',
        },
        '*, *::before, *::after': {
            borderColor: props.colorMode === 'dark' ? 'dark.border.primary' : 'light.border.primary',
        },
    }),
};

const components = {
    Button: {
        baseStyle: {
            fontWeight: '600',
            borderRadius: 'lg',
        },
        variants: {
            solid: (props) => ({
                bg: props.colorMode === 'dark' ? 'brand.600' : 'brand.500',
                color: 'white',
                _hover: {
                    bg: props.colorMode === 'dark' ? 'brand.700' : 'brand.600',
                    transform: 'translateY(-2px)',
                    boxShadow: 'lg',
                },
                _active: {
                    transform: 'translateY(0)',
                },
            }),
            outline: (props) => ({
                borderColor: props.colorMode === 'dark' ? 'dark.border.accent' : 'light.border.accent',
                color: props.colorMode === 'dark' ? 'dark.text.primary' : 'light.text.primary',
                _hover: {
                    bg: props.colorMode === 'dark' ? 'dark.bg.hover' : 'light.bg.hover',
                },
            }),
            ghost: (props) => ({
                color: props.colorMode === 'dark' ? 'dark.text.primary' : 'light.text.primary',
                _hover: {
                    bg: props.colorMode === 'dark' ? 'dark.bg.hover' : 'light.bg.hover',
                },
            }),
        },
    },
    Card: {
        baseStyle: (props) => ({
            container: {
                bg: props.colorMode === 'dark' ? 'dark.bg.card' : 'light.bg.card',
                borderRadius: 'xl',
                borderWidth: '1px',
                borderColor: props.colorMode === 'dark' ? 'dark.border.primary' : 'light.border.primary',
                boxShadow: props.colorMode === 'dark' ? 'dark-lg' : 'md',
                transition: 'all 0.3s',
                _hover: {
                    borderColor: props.colorMode === 'dark' ? 'dark.border.accent' : 'light.border.accent',
                    boxShadow: props.colorMode === 'dark' ? 'dark-xl' : 'xl',
                },
            },
        }),
    },
    Input: {
        variants: {
            outline: (props) => ({
                field: {
                    bg: props.colorMode === 'dark' ? 'dark.bg.secondary' : 'light.bg.primary',
                    borderColor: props.colorMode === 'dark' ? 'dark.border.primary' : 'light.border.primary',
                    color: props.colorMode === 'dark' ? 'dark.text.primary' : 'light.text.primary',
                    _hover: {
                        borderColor: props.colorMode === 'dark' ? 'dark.border.accent' : 'light.border.accent',
                    },
                    _focus: {
                        borderColor: 'brand.500',
                        boxShadow: `0 0 0 1px ${props.colorMode === 'dark' ? '#2196f3' : '#1976d2'}`,
                    },
                },
            }),
        },
    },
    Select: {
        variants: {
            outline: (props) => ({
                field: {
                    bg: props.colorMode === 'dark' ? 'dark.bg.secondary' : 'light.bg.primary',
                    borderColor: props.colorMode === 'dark' ? 'dark.border.primary' : 'light.border.primary',
                    color: props.colorMode === 'dark' ? 'dark.text.primary' : 'light.text.primary',
                    _hover: {
                        borderColor: props.colorMode === 'dark' ? 'dark.border.accent' : 'light.border.accent',
                    },
                },
            }),
        },
    },
    Table: {
        variants: {
            simple: (props) => ({
                th: {
                    color: props.colorMode === 'dark' ? 'dark.text.secondary' : 'light.text.secondary',
                    borderColor: props.colorMode === 'dark' ? 'dark.border.primary' : 'light.border.primary',
                    textTransform: 'uppercase',
                    fontSize: 'xs',
                    fontWeight: '700',
                    letterSpacing: 'wider',
                },
                td: {
                    borderColor: props.colorMode === 'dark' ? 'dark.border.primary' : 'light.border.primary',
                },
                tbody: {
                    tr: {
                        _hover: {
                            bg: props.colorMode === 'dark' ? 'dark.bg.hover' : 'light.bg.hover',
                        },
                    },
                },
            }),
        },
    },
    Modal: {
        baseStyle: (props) => ({
            dialog: {
                bg: props.colorMode === 'dark' ? 'dark.bg.card' : 'light.bg.card',
                borderRadius: 'xl',
                boxShadow: '2xl',
            },
            header: {
                color: props.colorMode === 'dark' ? 'dark.text.primary' : 'light.text.primary',
                borderBottomWidth: '1px',
                borderColor: props.colorMode === 'dark' ? 'dark.border.primary' : 'light.border.primary',
            },
            body: {
                color: props.colorMode === 'dark' ? 'dark.text.primary' : 'light.text.primary',
            },
        }),
    },
    Badge: {
        baseStyle: {
            fontWeight: '600',
            borderRadius: 'md',
            px: 2,
            py: 1,
        },
    },
    Stat: {
        baseStyle: (props) => ({
            label: {
                color: props.colorMode === 'dark' ? 'dark.text.secondary' : 'light.text.secondary',
                fontSize: 'sm',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: 'wide',
            },
            number: {
                color: props.colorMode === 'dark' ? 'dark.text.primary' : 'light.text.primary',
                fontWeight: '700',
            },
            helpText: {
                color: props.colorMode === 'dark' ? 'dark.text.tertiary' : 'light.text.tertiary',
            },
        }),
    },
};

const fonts = {
    heading: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
};

const shadows = {
    'dark-sm': '0 1px 2px 0 rgba(255, 255, 255, 0.05)',
    'dark-md': '0 4px 6px -1px rgba(255, 255, 255, 0.1), 0 2px 4px -1px rgba(255, 255, 255, 0.06)',
    'dark-lg': '0 10px 15px -3px rgba(255, 255, 255, 0.1), 0 4px 6px -2px rgba(255, 255, 255, 0.05)',
    'dark-xl': '0 20px 25px -5px rgba(255, 255, 255, 0.1), 0 10px 10px -5px rgba(255, 255, 255, 0.04)',
    'dark-2xl': '0 25px 50px -12px rgba(255, 255, 255, 0.25)',
};

const theme = extendTheme({
    config,
    colors,
    semanticTokens,
    styles,
    components,
    fonts,
    shadows,
});

export default theme;
