import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import './loader.css';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';

const Loader = ({ visible }: { visible: boolean }) => {
  const [postCount, setPostCount] = useState(0); // State to track the number of posts fetched

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    async function fetchPosts() {
      // Simulate fetching posts (replace this with actual API call if needed)
      const newPostCount = postCount + 12; // Increment by 12 posts
      setPostCount(newPostCount);

      // Show a toast notification with the updated post count
      toast.success(`Scraped total ${newPostCount} posts`, {
        duration: 2000,
      });

      // Optionally, save the last post count to chrome.storage.local
      await chrome.storage.local.set({ lastpostnumber: newPostCount });
    }

    if (visible) {
      // Start fetching posts every 3 seconds
      intervalId = setInterval(fetchPosts, 3000);
    }

    // Cleanup function to clear the interval
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [visible, postCount]); // Re-run the effect when `visible` or `postCount` changes

  return (
    <Dialog open={visible}>
      <DialogClose className="hidden" disabled={true} />
      <DialogContent className="min-h-[50vh] max-h-[50vh] max-w-[50vh] flex w-full h-full justify-center items-center">
        <div className="center-body absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
          <div className="loader-spanne-20">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <DialogTitle className="text-center w-full font-bold text-3xl text-white">
        </DialogTitle>
        <DialogDescription className="text-center text-white">
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default Loader;