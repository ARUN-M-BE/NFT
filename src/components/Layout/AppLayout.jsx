import { Box, Container, Flex } from '@chakra-ui/react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export const AppLayout = ({ children }) => {
    return (
        <Box minH='100vh'>
            <Header />
            <Container maxW='container.2xl'>
                <Flex gap={6}>
                    <Sidebar />
                    <Box flex={1} pb={8}>
                        {children}
                    </Box>
                </Flex>
            </Container>
        </Box>
    );
};
