import { Badge as ChakraBadge } from '@chakra-ui/react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export const PriceBadge = ({ change, showIcon = true, ...props }) => {
    const isPositive = change > 0;
    const isNegative = change < 0;

    const colorScheme = isPositive ? 'green' : isNegative ? 'red' : 'gray';
    const Icon = isPositive ? TrendingUp : isNegative ? TrendingDown : Minus;

    return (
        <ChakraBadge
            colorScheme={colorScheme}
            display='flex'
            alignItems='center'
            gap={1}
            px={2}
            py={1}
            borderRadius='md'
            {...props}
        >
            {showIcon && <Icon size={14} />}
            {isPositive && '+'}{change.toFixed(2)}%
        </ChakraBadge>
    );
};
