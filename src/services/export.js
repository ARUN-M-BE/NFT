import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Papa from 'papaparse';
import { formatCurrency, formatNumber } from '@/utils/formatters';

/**
 * Export Service
 * Handles PDF and CSV exports for portfolio and transaction data
 */

export const exportService = {
    /**
     * Export portfolio to PDF
     */
    exportPortfolioPDF(portfolio, user, currentPrices) {
        const doc = new jsPDF();

        // Header
        doc.setFontSize(24);
        doc.setTextColor(33, 150, 243);
        doc.text('Portfolio Report', 14, 20);

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);
        doc.text(`User: ${user?.email || 'Guest'}`, 14, 34);

        // Summary Box
        doc.setFillColor(240, 240, 240);
        doc.rect(14, 40, 182, 30, 'F');

        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.text('Portfolio Summary', 18, 48);

        doc.setFontSize(10);
        const totalValue = portfolio.calculatePortfolioValue(currentPrices);
        const profitLoss = portfolio.calculateProfitLoss(currentPrices);

        doc.text(`Total Value: ${formatCurrency(totalValue)}`, 18, 56);
        doc.text(`Total P/L: ${formatCurrency(profitLoss.amount)} (${profitLoss.percentage.toFixed(2)}%)`, 18, 62);
        doc.text(`Holdings: ${portfolio.holdings.length}`, 120, 56);
        doc.text(`Transactions: ${portfolio.transactions.length}`, 120, 62);

        // Holdings Table
        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text('Holdings', 14, 80);

        const holdingsData = portfolio.holdings.map(h => {
            const currentPrice = currentPrices?.find(p => p.pair === h.symbol)?.price || 0;
            const value = h.amount * parseFloat(currentPrice);
            const pl = value - (h.amount * h.buyPrice);
            const plPercent = ((pl / (h.amount * h.buyPrice)) * 100).toFixed(2);

            return [
                h.symbol,
                formatNumber(h.amount, 6),
                formatCurrency(h.buyPrice),
                formatCurrency(parseFloat(currentPrice)),
                formatCurrency(value),
                `${formatCurrency(pl)} (${plPercent}%)`,
            ];
        });

        doc.autoTable({
            startY: 85,
            head: [['Symbol', 'Amount', 'Buy Price', 'Current Price', 'Value', 'P/L']],
            body: holdingsData,
            theme: 'grid',
            headStyles: { fillColor: [33, 150, 243] },
            styles: { fontSize: 9 },
        });

        // Footer
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.text(
                `Page ${i} of ${pageCount}`,
                doc.internal.pageSize.width / 2,
                doc.internal.pageSize.height - 10,
                { align: 'center' }
            );
        }

        doc.save(`portfolio-report-${new Date().toISOString().split('T')[0]}.pdf`);
    },

    /**
     * Export transactions to CSV
     */
    exportTransactionsCSV(transactions) {
        const csvData = transactions.map(t => ({
            Date: new Date(t.date).toLocaleString(),
            Type: t.type,
            Symbol: t.symbol,
            Amount: t.amount,
            Price: t.price,
            Total: t.total,
            Notes: t.notes || '',
        }));

        const csv = Papa.unparse(csvData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    },

    /**
     * Export trade history to CSV
     */
    exportTradeHistoryCSV(tradeHistory) {
        const csvData = tradeHistory.map(t => ({
            Date: new Date(t.date).toLocaleString(),
            Type: t.type,
            Symbol: t.symbol,
            Amount: t.amount,
            Price: t.price,
            Total: t.total,
            'P/L': t.profitLoss || 'N/A',
        }));

        const csv = Papa.unparse(csvData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `trade-history-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    },

    /**
     * Export simulator performance to PDF
     */
    exportSimulatorPDF(simulator, currentPrices) {
        const doc = new jsPDF();

        // Header
        doc.setFontSize(24);
        doc.setTextColor(156, 39, 176);
        doc.text('Trading Simulator Report', 14, 20);

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);

        // Performance Summary
        doc.setFillColor(240, 240, 240);
        doc.rect(14, 35, 182, 35, 'F');

        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.text('Performance Summary', 18, 43);

        doc.setFontSize(10);
        const portfolioValue = simulator.calculatePortfolioValue(currentPrices);
        const profitLoss = simulator.calculateProfitLoss(currentPrices);
        const totalValue = simulator.balance + portfolioValue;

        doc.text(`Initial Balance: ${formatCurrency(simulator.initialBalance)}`, 18, 51);
        doc.text(`Current Balance: ${formatCurrency(simulator.balance)}`, 18, 57);
        doc.text(`Portfolio Value: ${formatCurrency(portfolioValue)}`, 18, 63);
        doc.text(`Total Value: ${formatCurrency(totalValue)}`, 120, 51);
        doc.text(`Total P/L: ${formatCurrency(profitLoss.amount)}`, 120, 57);
        doc.text(`ROI: ${profitLoss.percentage.toFixed(2)}%`, 120, 63);

        // Open Positions
        if (simulator.positions.length > 0) {
            doc.setFontSize(14);
            doc.text('Open Positions', 14, 80);

            const positionsData = simulator.positions.map(p => {
                const currentPrice = currentPrices?.find(pr => pr.pair === p.symbol)?.price || 0;
                const value = p.amount * parseFloat(currentPrice);
                const pl = value - (p.amount * p.entryPrice);
                const plPercent = ((pl / (p.amount * p.entryPrice)) * 100).toFixed(2);

                return [
                    p.symbol,
                    formatNumber(p.amount, 6),
                    formatCurrency(p.entryPrice),
                    formatCurrency(parseFloat(currentPrice)),
                    formatCurrency(value),
                    `${formatCurrency(pl)} (${plPercent}%)`,
                ];
            });

            doc.autoTable({
                startY: 85,
                head: [['Symbol', 'Amount', 'Entry Price', 'Current Price', 'Value', 'P/L']],
                body: positionsData,
                theme: 'grid',
                headStyles: { fillColor: [156, 39, 176] },
                styles: { fontSize: 9 },
            });
        }

        doc.save(`simulator-report-${new Date().toISOString().split('T')[0]}.pdf`);
    },
};
