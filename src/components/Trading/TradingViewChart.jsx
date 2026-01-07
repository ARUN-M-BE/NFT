import { useEffect, useRef, useState } from 'react';
import { Box, VStack, HStack, Button, ButtonGroup, useColorMode, Text, Icon } from '@chakra-ui/react';
import { createChart } from 'lightweight-charts';
import { TrendingUp, TrendingDown, Maximize2 } from 'lucide-react';
import { Card } from '../Common/Card';

export const TradingViewChart = ({ symbol, data = [] }) => {
    const chartContainerRef = useRef();
    const chartRef = useRef();
    const candlestickSeriesRef = useRef();
    const volumeSeriesRef = useRef();
    const { colorMode } = useColorMode();
    const [timeframe, setTimeframe] = useState('1D');

    useEffect(() => {
        if (!chartContainerRef.current) return;

        const chart = createChart(chartContainerRef.current, {
            width: chartContainerRef.current.clientWidth,
            height: 500,
            layout: {
                background: { color: colorMode === 'dark' ? '#000000' : '#ffffff' },
                textColor: colorMode === 'dark' ? '#ffffff' : '#1a1a1a',
            },
            grid: {
                vertLines: { color: colorMode === 'dark' ? '#1a1a1a' : '#f1f3f5' },
                horzLines: { color: colorMode === 'dark' ? '#1a1a1a' : '#f1f3f5' },
            },
            crosshair: {
                mode: 1,
                vertLine: {
                    color: '#2196f3',
                    width: 1,
                    style: 2,
                    labelBackgroundColor: '#2196f3',
                },
                horzLine: {
                    color: '#2196f3',
                    width: 1,
                    style: 2,
                    labelBackgroundColor: '#2196f3',
                },
            },
            rightPriceScale: {
                borderColor: colorMode === 'dark' ? '#2a2a2a' : '#dee2e6',
            },
            timeScale: {
                borderColor: colorMode === 'dark' ? '#2a2a2a' : '#dee2e6',
                timeVisible: true,
                secondsVisible: false,
            },
        });

        // Candlestick series
        const candlestickSeries = chart.addCandlestickSeries({
            upColor: '#4caf50',
            downColor: '#f44336',
            borderVisible: false,
            wickUpColor: '#4caf50',
            wickDownColor: '#f44336',
        });

        // Volume series
        const volumeSeries = chart.addHistogramSeries({
            color: '#26a69a',
            priceFormat: {
                type: 'volume',
            },
            priceScaleId: '',
            scaleMargins: {
                top: 0.8,
                bottom: 0,
            },
        });

        chartRef.current = chart;
        candlestickSeriesRef.current = candlestickSeries;
        volumeSeriesRef.current = volumeSeries;

        // Handle resize
        const handleResize = () => {
            if (chartContainerRef.current) {
                chart.applyOptions({
                    width: chartContainerRef.current.clientWidth,
                });
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, [colorMode]);

    useEffect(() => {
        if (candlestickSeriesRef.current && data.length > 0) {
            // Format data for TradingView
            const formattedData = data.map(candle => ({
                time: candle.time / 1000, // Convert to seconds
                open: parseFloat(candle.open),
                high: parseFloat(candle.high),
                low: parseFloat(candle.low),
                close: parseFloat(candle.close),
            }));

            const volumeData = data.map(candle => ({
                time: candle.time / 1000,
                value: parseFloat(candle.volume),
                color: parseFloat(candle.close) >= parseFloat(candle.open) ? '#4caf5080' : '#f4433680',
            }));

            candlestickSeriesRef.current.setData(formattedData);
            volumeSeriesRef.current.setData(volumeData);

            // Fit content
            chartRef.current.timeScale().fitContent();
        }
    }, [data]);

    const timeframes = [
        { label: '1m', value: '1m' },
        { label: '5m', value: '5m' },
        { label: '15m', value: '15m' },
        { label: '1h', value: '1h' },
        { label: '4h', value: '4h' },
        { label: '1D', value: '1D' },
        { label: '1W', value: '1W' },
    ];

    const isPositive = data.length > 0 && parseFloat(data[data.length - 1].close) >= parseFloat(data[0].open);

    return (
        <Card>
            <VStack align='stretch' spacing={4}>
                <HStack justify='space-between'>
                    <HStack spacing={3}>
                        <Text fontSize='xl' fontWeight='800'>
                            {symbol}
                        </Text>
                        {data.length > 0 && (
                            <HStack spacing={2}>
                                <Icon as={isPositive ? TrendingUp : TrendingDown} color={isPositive ? 'success.500' : 'danger.500'} />
                                <Text fontSize='2xl' fontWeight='900' color={isPositive ? 'success.500' : 'danger.500'}>
                                    ${parseFloat(data[data.length - 1].close).toFixed(2)}
                                </Text>
                            </HStack>
                        )}
                    </HStack>

                    <HStack spacing={4}>
                        <ButtonGroup size='sm' isAttached variant='outline'>
                            {timeframes.map(tf => (
                                <Button
                                    key={tf.value}
                                    onClick={() => setTimeframe(tf.value)}
                                    bg={timeframe === tf.value ? 'brand.500' : 'transparent'}
                                    color={timeframe === tf.value ? 'white' : 'inherit'}
                                    _hover={{
                                        bg: timeframe === tf.value ? 'brand.600' : colorMode === 'dark' ? 'whiteAlpha.100' : 'blackAlpha.50',
                                    }}
                                    fontWeight='700'
                                >
                                    {tf.label}
                                </Button>
                            ))}
                        </ButtonGroup>

                        <Button size='sm' leftIcon={<Maximize2 size={16} />} variant='outline'>
                            Fullscreen
                        </Button>
                    </HStack>
                </HStack>

                <Box ref={chartContainerRef} w='100%' h='500px' borderRadius='lg' overflow='hidden' />

                <HStack justify='space-between' fontSize='sm' color={colorMode === 'dark' ? 'text-secondary' : 'gray.600'}>
                    <Text fontWeight='600'>
                        O: ${data.length > 0 ? parseFloat(data[0].open).toFixed(2) : '0.00'}
                    </Text>
                    <Text fontWeight='600'>
                        H: ${data.length > 0 ? Math.max(...data.map(d => parseFloat(d.high))).toFixed(2) : '0.00'}
                    </Text>
                    <Text fontWeight='600'>
                        L: ${data.length > 0 ? Math.min(...data.map(d => parseFloat(d.low))).toFixed(2) : '0.00'}
                    </Text>
                    <Text fontWeight='600'>
                        C: ${data.length > 0 ? parseFloat(data[data.length - 1].close).toFixed(2) : '0.00'}
                    </Text>
                    <Text fontWeight='600'>
                        Vol: {data.length > 0 ? parseFloat(data[data.length - 1].volume).toFixed(2) : '0.00'}
                    </Text>
                </HStack>
            </VStack>
        </Card>
    );
};
