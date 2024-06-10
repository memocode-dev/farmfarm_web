'use client';

import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import {ModalProvider} from "@/context/ModalConext";

const queryClient = new QueryClient();

interface ClientProvidersProps {
    children: ReactNode;
}

const ClientProviders = ({ children }: ClientProvidersProps) => {
    return (
        <QueryClientProvider client={queryClient}>
            <Toaster />
            <ModalProvider>
                {children}
            </ModalProvider>
        </QueryClientProvider>
    );
};

export default ClientProviders;
