import { Box, Container, Flex } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export const AppLayout = () => {
    return (
        <Box minH='100vh'>
            <Header />
            <Container maxW='container.2xl'>
                <Flex gap={6}>
                    <Sidebar />
                    <Box flex={1} pb={8}>
                        <Outlet />
                    </Box>
                </Flex>
            </Container>
        </Box>
    );
};
