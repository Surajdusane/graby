import { checkChromeStorageCache } from '@/lib/checkLocalQuery';
import { sendMessageToBackground } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';

export const useGetPost = (username: string | null) => {
    const {data, isLoading, error, refetch} = useQuery({
        queryKey: [username + "post"],
        queryFn: async () => {
            const cachedData = await checkChromeStorageCache<any>({
                queryKey: username as string + "post",
                maxAge: 1000 * 60 * 60 * 0.10
              });

              if (cachedData) {
                return cachedData;
              }
            chrome.storage.local.set({lastfetchtime : Date.now()});
            const response = await sendMessageToBackground("getpost", { username });
            console.log("Response from sendMessageToBackground:", response);

            return response;
        },
        enabled: false,
        refetchOnMount: false,
        staleTime: 1000 * 60 * 60 * 0.1, 
        refetchOnWindowFocus: false,
        refetchOnReconnect: false
        
    })
    return {data, isLoading, error, refetch};
}