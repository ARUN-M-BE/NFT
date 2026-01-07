import { Box } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

export const Card = ({ children, hover = true, ...props }) => {
    return (
        <MotionBox
            className="glass-card"
            p={6}
            whileHover={hover ? { scale: 1.02, y: -4 } : {}}
            transition={{ duration: 0.3 }}
            {...props}
        >
            {children}
        </MotionBox>
    );
};
