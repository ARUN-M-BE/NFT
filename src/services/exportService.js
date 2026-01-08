import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Papa from 'papaparse';
import { formatCurrency, formatPercentage, formatDate } from '@/utils/formatters';

/**
 * Export Service
 * Handles PDF and CSV exports for portfolio, transactions, and trade history
 */

export const exportService = {
    /**
     * Export portfolio to PDF
     * @param {Object} portfolioData - Portfolio data including holdings, transactions, metrics
     */
    exportPortfolioPDF(portfolioData) {
        const { holdings = [], transactions = [], metrics = {} } = portfolioData;

        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        // Header
        doc.setFontSize(24);
        doc.setTextColor(33, 150, 243);
        doc.text('Portfolio Report', pageWidth / 2, 20, { align: 'center' });

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Generated on ${formatDate(new Date())}`, pageWidth / 2, 28, { align: 'center' });

        // Summary Section
        doc.setFontSize(16);
        doc.setTextColor(0);
        doc.text('Portfolio Summary', 14, 45);

        const summaryData = [
            ['Total Value', formatCurrency(metrics.totalValue || 0)],
            ['Total Profit/Loss', formatCurrency(metrics.totalPnL || 0)],
            ['P/L Percentage', formatPercentage(metrics.pnlPercentage || 0)],
            ['Number of Holdings', (holdings.length || 0).toString()],
            ['Total Transactions', (transactions.length || 0).toString()],
        ];

        doc.autoTable({
            startY: 50,
            head: [['Metric', 'Value']],
            body: summaryData,
            theme: 'grid',
            headStyles: { fillColor: [33, 150, 243] },
            margin: { left: 14, right: 14 },
        });

        // Holdings Section
        if (holdings.length > 0) {
            doc.setFontSize(16);
            doc.text('Current Holdings', 14, doc.lastAutoTable.finalY + 15);

            const holdingsData = holdings.map(h => [
                h.symbol || h.asset,
                h.amount || h.quantity,
                formatCurrency(h.buyPrice || h.avgPrice || 0),
                formatCurrency(h.currentPrice || 0),
                formatCurrency(h.totalValue || 0),
                formatCurrency(h.pnl || 0),
                formatPercentage(h.pnlPercentage || 0),
            ]);

            doc.autoTable({
                startY: doc.lastAutoTable.finalY + 20,
                head: [['Asset', 'Amount', 'Buy Price', 'Current Price', 'Total Value', 'P/L', 'P/L %']],
                body: holdingsData,
                theme: 'striped',
                headStyles: { fillColor: [33, 150, 243] },
                margin: { left: 14, right: 14 },
                styles: { fontSize: 8 },
            });
        }

        // Recent Transactions Section
        if (transactions.length > 0) {
            const recentTransactions = transactions.slice(0, 10);

            doc.addPage();
            doc.setFontSize(16);
            doc.text('Recent Transactions', 14, 20);

            const transactionsData = recentTransactions.map(t => [
                formatDate(t.date || t.timestamp),
                t.type || t.action,
                t.symbol || t.asset,
                t.amount || t.quantity,
                formatCurrency(t.price || 0),
                formatCurrency(t.total || 0),
            ]);

            doc.autoTable({
                startY: 25,
                head: [['Date', 'Type', 'Asset', 'Amount', 'Price', 'Total']],
                body: transactionsData,
                theme: 'striped',
                headStyles: { fillColor: [33, 150, 243] },
                margin: { left: 14, right: 14 },
                styles: { fontSize: 8 },
            });
        }

        // Footer
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.text(
                `Page ${i} of ${pageCount} | ALL Exchange - Premium Trading Dashboard`,
                pageWidth / 2,
                doc.internal.pageSize.getHeight() - 10,
                { align: 'center' }
            );
        }

        // Save PDF
        doc.save(`portfolio-report-${Date.now()}.pdf`);
    },

    /**
     * Export transactions to CSV
     * @param {Array} transactions - Array of transaction objects
     */
    exportTransactionsCSV(transactions) {
        if (!transactions || transactions.length === 0) {
            console.warn('No transactions to export');
            return;
        }

        const csvData = transactions.map(t => ({
            Date: formatDate(t.date || t.timestamp),
            Type: t.type || t.action,
            Asset: t.symbol || t.asset,
            Amount: t.amount || t.quantity,
            Price: t.price || 0,
            Total: t.total || 0,
            Fee: t.fee || 0,
            Notes: t.notes || '',
        }));

        const csv = Papa.unparse(csvData);
        this.downloadCSV(csv, `transactions-${Date.now()}.csv`);
    },

    /**
     * Export trade history to CSV
     * @param {Array} trades - Array of trade objects
     */
    exportTradeHistoryCSV(trades) {
        if (!trades || trades.length === 0) {
            console.warn('No trades to export');
            return;
        }

        const csvData = trades.map(t => ({
            Date: formatDate(t.timestamp || t.date),
            Pair: t.pair || t.symbol,
            Type: t.type || t.side,
            Amount: t.amount || t.quantity,
            'Entry Price': t.entryPrice || t.price,
            'Exit Price': t.exitPrice || 0,
            'P/L': t.pnl || 0,
            'P/L %': t.pnlPercentage || 0,
            Status: t.status || 'Closed',
        }));

        const csv = Papa.unparse(csvData);
        this.downloadCSV(csv, `trade-history-${Date.now()}.csv`);
    },

    /**
     * Export holdings to CSV
     * @param {Array} holdings - Array of holding objects
     */
    exportHoldingsCSV(holdings) {
        if (!holdings || holdings.length === 0) {
            console.warn('No holdings to export');
            return;
        }

        const csvData = holdings.map(h => ({
            Asset: h.symbol || h.asset,
            Amount: h.amount || h.quantity,
            'Buy Price': h.buyPrice || h.avgPrice || 0,
            'Current Price': h.currentPrice || 0,
            'Total Value': h.totalValue || 0,
            'P/L': h.pnl || 0,
            'P/L %': h.pnlPercentage || 0,
            'Purchase Date': formatDate(h.purchaseDate || h.date),
        }));

        const csv = Papa.unparse(csvData);
        this.downloadCSV(csv, `holdings-${Date.now()}.csv`);
    },

    /**
     * Helper function to download CSV
     * @param {string} csvContent - CSV content as string
     * @param {string} filename - Filename for download
     */
    downloadCSV(csvContent, filename) {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    },

    /**
     * Export custom data to CSV
     * @param {Array} data - Array of objects to export
     * @param {string} filename - Filename for download
     */
    exportCustomCSV(data, filename = 'export.csv') {
        if (!data || data.length === 0) {
            console.warn('No data to export');
            return;
        }

        const csv = Papa.unparse(data);
        this.downloadCSV(csv, filename);
    },
};

export default exportService;
