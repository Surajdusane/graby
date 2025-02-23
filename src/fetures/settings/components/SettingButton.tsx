import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"
import { useSetting } from "../hooks/use-open-setting"

export default function SettingsButton() {
  const { onOpen } = useSetting()

  return (
      <Button variant="outline" size="icon" onClick={onOpen} className="relative peer">
        <div className={`transition-transform duration-500 ease-in-out peer-hover:rotate-180 hover:rotate-180 `}>
          <Settings className="size-7" />
        </div>
      </Button>
  )
}

