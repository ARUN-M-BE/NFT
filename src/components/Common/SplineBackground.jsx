import Spline from '@splinetool/react-spline';
import { Box, useColorMode } from '@chakra-ui/react';
import { useState } from 'react';

export const SplineBackground = ({ scene = 'crypto' }) => {
    const { colorMode } = useColorMode();
    const [loading, setLoading] = useState(true);

    // Spline scene URLs (you can replace with your own Spline scenes)
    const scenes = {
        crypto: 'https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode',
        abstract: 'https://prod.spline.design/Br2ec4cqLxYBKNA6/scene.splinecode',
    };

    return (
        <Box
            className='spline-container'
            opacity={loading ? 0 : colorMode === 'dark' ? 0.3 : 0.2}
            transition='opacity 1s ease-in-out'
        >
            <Spline
                scene={scenes[scene] || scenes.crypto}
                onLoad={() => setLoading(false)}
                style={{
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                }}
            />
        </Box>
    );
};
