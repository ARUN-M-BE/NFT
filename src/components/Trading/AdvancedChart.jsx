import { useEffect, useRef, useState } from 'react';
import { Box, Flex, HStack, IconButton, Select, Tooltip, useColorMode } from '@chakra-ui/react';
import { createChart } from 'lightweight-charts';
import { Maximize2, Minimize2, Download } from 'lucide-react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const AdvancedChart = ({ symbol, data = [], timeframe = '1hr', onTimeframeChange }) => {
    const chartContainerRef = useRef(null);
    const chartRef = useRef(null);
    const candlestickSeriesRef = useRef(null);
    const volumeSeriesRef = useRef(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const { colorMode } = useColorMode();

    const isDark = colorMode === 'dark';

    // Chart colors based on theme
    const chartColors = {
        background: isDark ? '#000000' : '#ffffff',
        textColor: isDark ? '#d1d4dc' : '#191919',
        gridColor: isDark ? '#2a2e39' : '#e1e3eb',
        upColor: '#26a69a',
        downColor: '#ef5350',
        volumeUpColor: 'rgba(38, 166, 154, 0.5)',
        volumeDownColor: 'rgba(239, 83, 80, 0.5)',
    };

    useEffect(() => {
        if (!chartContainerRef.current || !data || data.length === 0) return;

        // Create chart
        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { color: chartColors.background },
                textColor: chartColors.textColor,
            },
            grid: {
                vertLines: { color: chartColors.gridColor },
                horzLines: { color: chartColors.gridColor },
            },
            crosshair: {
                mode: 1,
                vertLine: {
                    width: 1,
                    color: isDark ? '#758696' : '#9598a1',
                    style: 3,
                },
                horzLine: {
                    width: 1,
                    color: isDark ? '#758696' : '#9598a1',
                    style: 3,
                },
            },
            rightPriceScale: {
                borderColor: chartColors.gridColor,
                scaleMargins: {
                    top: 0.1,
                    bottom: 0.2,
                },
            },
            timeScale: {
                borderColor: chartColors.gridColor,
                timeVisible: true,
                secondsVisible: false,
            },
            handleScroll: {
                mouseWheel: true,
                pressedMouseMove: true,
                horzTouchDrag: true,
                vertTouchDrag: true,
            },
            handleScale: {
                axisPressedMouseMove: true,
                mouseWheel: true,
                pinch: true,
            },
        });

        chartRef.current = chart;

        // Add candlestick series
        const candlestickSeries = chart.addCandlestickSeries({
            upColor: chartColors.upColor,
            downColor: chartColors.downColor,
            borderVisible: false,
            wickUpColor: chartColors.upColor,
            wickDownColor: chartColors.downColor,
        });

        candlestickSeriesRef.current = candlestickSeries;

        // Add volume series
        const volumeSeries = chart.addHistogramSeries({
            color: chartColors.volumeUpColor,
            priceFormat: {
                type: 'volume',
            },
            priceScaleId: '',
            scaleMargins: {
                top: 0.8,
                bottom: 0,
            },
        });

        volumeSeriesRef.current = volumeSeries;

        // Set data
        if (data && data.length > 0) {
            const candleData = data.map(candle => ({
                time: candle.time,
                open: parseFloat(candle.open),
                high: parseFloat(candle.high),
                low: parseFloat(candle.low),
                close: parseFloat(candle.close),
            }));

            const volumeData = data.map(candle => ({
                time: candle.time,
                value: parseFloat(candle.volume),
                color: parseFloat(candle.close) >= parseFloat(candle.open)
                    ? chartColors.volumeUpColor
                    : chartColors.volumeDownColor,
            }));

            candlestickSeries.setData(candleData);
            volumeSeries.setData(volumeData);
        }

        // Handle resize
        const handleResize = () => {
            if (chartContainerRef.current && chart) {
                chart.applyOptions({
                    width: chartContainerRef.current.clientWidth,
                    height: chartContainerRef.current.clientHeight,
                });
            }
        };

        window.addEventListener('resize', handleResize);

        // Fit content
        chart.timeScale().fitContent();

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, [data, isDark]);

    const handleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    const handleDownload = () => {
        if (!chartRef.current) return;

        // Take screenshot of chart
        const canvas = chartContainerRef.current.querySelector('canvas');
        if (canvas) {
            canvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.download = `${symbol}-${timeframe}-chart.png`;
                link.href = url;
                link.click();
                URL.revokeObjectURL(url);
            });
        }
    };

    const timeframes = [
        { value: '1m', label: '1m' },
        { value: '5m', label: '5m' },
        { value: '15m', label: '15m' },
        { value: '30m', label: '30m' },
        { value: '1hr', label: '1h' },
        { value: '6hr', label: '6h' },
        { value: '1day', label: '1D' },
    ];

    return (
        <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            position={isFullscreen ? 'fixed' : 'relative'}
            top={isFullscreen ? 0 : 'auto'}
            left={isFullscreen ? 0 : 'auto'}
            right={isFullscreen ? 0 : 'auto'}
            bottom={isFullscreen ? 0 : 'auto'}
            zIndex={isFullscreen ? 9999 : 1}
            bg={chartColors.background}
            borderRadius={isFullscreen ? 0 : 'xl'}
            overflow='hidden'
            border='1px solid'
            borderColor={isDark ? 'whiteAlpha.100' : 'blackAlpha.100'}
            boxShadow={isFullscreen ? 'none' : 'lg'}
        >
            {/* Chart Toolbar */}
            <Flex
                justify='space-between'
                align='center'
                px={4}
                py={3}
                borderBottom='1px solid'
                borderColor={isDark ? 'whiteAlpha.100' : 'blackAlpha.100'}
                bg={isDark ? 'whiteAlpha.50' : 'blackAlpha.50'}
            >
                {/* Timeframe Selector */}
                <HStack spacing={2}>
                    {timeframes.map((tf) => (
                        <Box
                            key={tf.value}
                            as='button'
                            px={3}
                            py={1.5}
                            borderRadius='md'
                            fontSize='sm'
                            fontWeight='600'
                            bg={timeframe === tf.value ? 'brand.500' : 'transparent'}
                            color={timeframe === tf.value ? 'white' : isDark ? 'gray.400' : 'gray.600'}
                            _hover={{
                                bg: timeframe === tf.value ? 'brand.600' : isDark ? 'whiteAlpha.100' : 'blackAlpha.50',
                            }}
                            transition='all 0.2s'
                            onClick={() => onTimeframeChange?.(tf.value)}
                        >
                            {tf.label}
                        </Box>
                    ))}
                </HStack>

                {/* Chart Actions */}
                <HStack spacing={2}>
                    <Tooltip label='Download Chart' placement='top'>
                        <IconButton
                            icon={<Download size={16} />}
                            size='sm'
                            variant='ghost'
                            onClick={handleDownload}
                            aria-label='Download chart'
                        />
                    </Tooltip>
                    <Tooltip label={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'} placement='top'>
                        <IconButton
                            icon={isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                            size='sm'
                            variant='ghost'
                            onClick={handleFullscreen}
                            aria-label='Toggle fullscreen'
                        />
                    </Tooltip>
                </HStack>
            </Flex>

            {/* Chart Container */}
            <Box
                ref={chartContainerRef}
                w='100%'
                h={isFullscreen ? 'calc(100vh - 60px)' : '500px'}
                position='relative'
            />
        </MotionBox>
    );
};

export default AdvancedChart;
