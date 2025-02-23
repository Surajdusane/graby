import { SelectFilter } from "@/components/Global/SelectFileter";
import SwitchCard from "@/components/Global/SwitchCard";
import { Button } from "@/components/ui/button";
import { useFilterStore } from "@/Store/filter";
import { Plus } from "lucide-react";
import DownloadVideoButton from "./DownloadVideoButton";
import { useNewFilter } from "@/fetures/filter/hooks/use-new-filter";
import FiilterPage from "@/fetures/filter/components/FiilterPage";

const Video = () => {
  const { onOpen } = useNewFilter() 
    const { checked } = useFilterStore();
  return (
    <div className="flex flex-col justify-between min-h-full">
      <FiilterPage />
        <SwitchCard />
        <div className="flex flex-col gap-y-2 py-6 px-2">
            <SelectFilter disabled={!checked} />
            <Button onClick={onOpen} variant={"outline"} disabled={!checked} className="w-full"><Plus/>Create Filter</Button>
        </div>
        <div className="flex justify-between items-center gap-x-4 my-4">
        <DownloadVideoButton />
        </div>
    </div>
  )
}

export default Video