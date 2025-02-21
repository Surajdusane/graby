import { checkChromeStorageCache } from '@/lib/checkLocalQuery';
import { sendMessageToBackground } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';

export const useGetProfileInfo = (username: string | null) => {
    const {data, isLoading, error} = useQuery({
        queryKey: [username],
        queryFn: async () => {
            const cachedData = await checkChromeStorageCache<any>({
                queryKey: username as string,
                maxAge: 1000 * 60 * 60 * 0.10
              });

              if (cachedData) {
                return cachedData;
              }
            const response = await sendMessageToBackground("getuser", { username });
            chrome.storage.local.set({lastpostnumber : response.post});
            console.log("Response from sendMessageToBackground:", response);

            return response;
        },
        refetchOnMount: false,
        staleTime: 1000 * 60 * 60 * 0.1, 
        refetchOnWindowFocus: false,
        refetchOnReconnect: false
        
    })
    return {data, isLoading, error};
}