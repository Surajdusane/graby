import { SelectFileter } from "@/components/Global/SelectFileter";
import SwitchCard from "@/components/Global/SwitchCard";
import { Button } from "@/components/ui/button";
import { useFilterStore } from "@/Store/filter";
import { Plus } from "lucide-react";
import DownloadVideoButton from "./DownloadVideoButton";

const Video = () => {
    const { checked } = useFilterStore();
  return (
    <div className="flex flex-col justify-between min-h-full">
        <SwitchCard />
        <div className="flex flex-col gap-y-2 py-6 ">
            <SelectFileter disabled={!checked} />
            <Button variant={"outline"} disabled={!checked} className="w-full"><Plus/> Create Filter</Button>
        </div>
        <div className="flex justify-between items-center gap-x-4 my-4">
        <DownloadVideoButton />
        </div>
    </div>
  )
}

export default Video