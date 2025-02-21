import { useState, useEffect } from 'react';

function useTimeCheck() {
  const [isTimeExceeded, setIsTimeExceeded] = useState<boolean>(false);
  const [remainingTime, setRemainingTime] = useState<number>(0);

  useEffect(() => {
    const checkTime = () => {
      chrome.storage.local.get(['lastfetchtime', 'lastpostnumber'], (result) => {
        const lastFetchedTime = result.lastfetchtime;
        const lastPostNumber = result.lastpostnumber;

        // If either value is missing, assume no time restriction
        if (!lastFetchedTime || !lastPostNumber) {
          setIsTimeExceeded(false);
          setRemainingTime(0);
          return;
        }

        const currentTime = Date.now();
        const lastFetchedTimeNumber = parseInt(lastFetchedTime.toString(), 10);
        const lastPostNumberValue = parseInt(lastPostNumber.toString(), 10);

        // Calculate the condition time
        const conditionTime = lastFetchedTimeNumber + lastPostNumberValue * 2000; // last fetchtime + lastpostnumber * 2 seconds

        if (currentTime >= conditionTime) {
          setIsTimeExceeded(true);
          setRemainingTime(0);
          clearInterval(intervalId); // Stop the interval once time is exceeded
        } else {
          const timeRemaining = conditionTime - currentTime;
          setIsTimeExceeded(false);
          setRemainingTime(timeRemaining);
        }
      });
    };

    // Initial check when the component mounts
    checkTime();

    // Set up the interval to update the remaining time every second
    const intervalId = setInterval(() => {
      if (!isTimeExceeded) {
        checkTime();
      }
    }, 1000); // Update every 1000ms (1 second)

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [isTimeExceeded]);

  return { isTimeExceeded, remainingTime };
}

export default useTimeCheck;