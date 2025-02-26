import { useEffect, useState } from "react";

const useGetOnlineStatus = () => {
  const [onlineStatus, setOnlineStatus] = useState<boolean>(false);

  useEffect(() => {
    const checkOnlineStatus = async () => {
      const response = await chrome.runtime.sendMessage({
        action: "checkOnlineStatus",
      });
      setOnlineStatus(response.isOnline);
    };

    checkOnlineStatus();
  }, []);

  return onlineStatus;
};

export default useGetOnlineStatus;