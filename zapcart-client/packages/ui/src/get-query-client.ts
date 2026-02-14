import { QueryClient , isServer } from '@tanstack/react-query';

let browserQueryClient : QueryClient | undefined = undefined;

export const getQueryClient = ()=>{
    if (isServer) {
        return new QueryClient({
            defaultOptions: {
                queries: {
                    staleTime: 1000 * 60 
                },
            },
        });
    }
    else{
        if(!browserQueryClient) browserQueryClient = new QueryClient();
        return browserQueryClient;
    }
}
