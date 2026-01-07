import axios from 'axios';
import { CURRENCY_API_KEY, CURRENCY_API_URL } from '@/config/api';

/**
 * Currency Layer API Service
 * Provides real-time currency exchange rates
 */

const currencyClient = axios.create({
    baseURL: CURRENCY_API_URL,
    timeout: 10000,
});

export const currencyAPI = {
    /**
     * Get live exchange rates
     * @param {string} source - Source currency (default: USD)
     * @param {string[]} currencies - Target currencies
     */
    async getLiveRates(source = 'USD', currencies = ['EUR', 'GBP', 'CAD', 'PLN']) {
        try {
            const response = await currencyClient.get('', {
                params: {
                    access_key: CURRENCY_API_KEY,
                    currencies: currencies.join(','),
                    source,
                    format: 1,
                },
            });

            if (!response.data.success) {
                throw new Error(response.data.error?.info || 'Failed to fetch currency rates');
            }

            return {
                success: true,
                source: response.data.source,
                quotes: response.data.quotes,
                timestamp: response.data.timestamp,
            };
        } catch (error) {
            console.error('Currency API error:', error);
            return {
                success: false,
                error: error.message,
            };
        }
    },

    /**
     * Convert amount from one currency to another
     * @param {number} amount - Amount to convert
     * @param {string} from - Source currency
     * @param {string} to - Target currency
     */
    async convert(amount, from, to) {
        try {
            const rates = await this.getLiveRates(from, [to]);

            if (!rates.success) {
                throw new Error(rates.error);
            }

            const rateKey = `${from}${to}`;
            const rate = rates.quotes[rateKey];

            if (!rate) {
                throw new Error(`Exchange rate not found for ${from} to ${to}`);
            }

            return {
                success: true,
                from,
                to,
                amount,
                rate,
                result: amount * rate,
                timestamp: rates.timestamp,
            };
        } catch (error) {
            console.error('Currency conversion error:', error);
            return {
                success: false,
                error: error.message,
            };
        }
    },

    /**
     * Get multiple currency rates
     */
    async getMultipleRates(currencies = ['EUR', 'GBP', 'CAD', 'PLN', 'JPY', 'AUD', 'CHF']) {
        return this.getLiveRates('USD', currencies);
    },
};
