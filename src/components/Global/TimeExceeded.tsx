import { CircleAlert } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import HeaderLogo from "./HeaderLogo";

const TimeExceeded = ({ time }: { time: number }) => {
  const handleSkip = () => {
    // Clear the relevant storage keys
    chrome.storage.local.remove(['lastfetchtime', 'lastpostnumber'], () => {
      // Programmatically navigate to the Home tab
      const tabs = document.querySelectorAll('[data-state="active"]');
      if (tabs.length > 0) {
        const homeTab = document.querySelector('[value="home"]');
        if (homeTab) {
          (homeTab as HTMLElement).click(); // Simulate a click on the "Home" tab
        }
      }
    });
  };

  return (
    <Card className="min-w-[450px] min-h-[450px]">
      <CardHeader>
        <HeaderLogo />
        <CardTitle className="text-2xl font-bold">Time Exceeded</CardTitle>
      </CardHeader>
      <CardContent className="font-pop">
        <div className="relative overflow-hidden rounded-xl bg-zinc-950 px-6 py-8 sm:px-12 sm:py-10 shadow-lg dark:border dark:border-zinc-700 min-w-[350px]">
          <h1 className="text-sm font-medium">
            This time is shown because you asked to get data from the last account. This time is needed to complete the previous request. Once that's done, you can get the new data. If you'd like, you can skip this waiting time by clicking the "Skip" button.
          </h1>
          <h2 className="text-2xl font-semibold text-rose-700 text-center mt-4">
            {Math.ceil(time / 1000)} seconds remaining
          </h2>
          <Button
            className="w-full mt-4"
            variant="default"
            onClick={handleSkip}
          >
            Skip
          </Button>
          <div className="rounded-lg border border-border px-4 py-3 mt-4">
            <p className="text-sm">
              <CircleAlert
                className="-mt-0.5 me-3 inline-flex text-rose-700"
                size={16}
                strokeWidth={2}
                aria-hidden="true"
              />
              Sometimes, if you don't wait, your account might get banned.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimeExceeded;