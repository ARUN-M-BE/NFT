import { Menu, MenuButton, MenuList, MenuItem, Button, Icon, useToast } from '@chakra-ui/react';
import { Download, FileText, Table } from 'lucide-react';
import { exportService } from '@/services/export';
import { usePortfolio } from '@/context/PortfolioContext';
import { useSimulator } from '@/context/SimulatorContext';
import { useAuth } from '@/context/AuthContext';
import { usePolling } from '@/hooks/useGeminiAPI';
import { getAllPrices } from '@/api';
import { REFRESH_INTERVALS } from '@/utils/constants';

export const ExportMenu = ({ type = 'portfolio' }) => {
    const { user } = useAuth();
    const portfolio = usePortfolio();
    const simulator = useSimulator();
    const toast = useToast();
    const { data: prices } = usePolling(getAllPrices, REFRESH_INTERVALS.PRICES);

    const handleExportPortfolioPDF = () => {
        try {
            exportService.exportPortfolioPDF(portfolio, user, prices);
            toast({
                title: 'Export successful',
                description: 'Portfolio exported to PDF',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: 'Export failed',
                description: error.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const handleExportTransactionsCSV = () => {
        try {
            exportService.exportTransactionsCSV(portfolio.transactions);
            toast({
                title: 'Export successful',
                description: 'Transactions exported to CSV',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: 'Export failed',
                description: error.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const handleExportSimulatorPDF = () => {
        try {
            exportService.exportSimulatorPDF(simulator, prices);
            toast({
                title: 'Export successful',
                description: 'Simulator report exported to PDF',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: 'Export failed',
                description: error.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const handleExportTradeHistoryCSV = () => {
        try {
            exportService.exportTradeHistoryCSV(simulator.tradeHistory);
            toast({
                title: 'Export successful',
                description: 'Trade history exported to CSV',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: 'Export failed',
                description: error.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <Menu>
            <MenuButton
                as={Button}
                rightIcon={<Download size={16} />}
                size='sm'
                variant='outline'
                fontWeight='700'
            >
                Export
            </MenuButton>
            <MenuList>
                {type === 'portfolio' && (
                    <>
                        <MenuItem icon={<Icon as={FileText} />} onClick={handleExportPortfolioPDF}>
                            Export Portfolio (PDF)
                        </MenuItem>
                        <MenuItem icon={<Icon as={Table} />} onClick={handleExportTransactionsCSV}>
                            Export Transactions (CSV)
                        </MenuItem>
                    </>
                )}
                {type === 'simulator' && (
                    <>
                        <MenuItem icon={<Icon as={FileText} />} onClick={handleExportSimulatorPDF}>
                            Export Report (PDF)
                        </MenuItem>
                        <MenuItem icon={<Icon as={Table} />} onClick={handleExportTradeHistoryCSV}>
                            Export Trade History (CSV)
                        </MenuItem>
                    </>
                )}
            </MenuList>
        </Menu>
    );
};
