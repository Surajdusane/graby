import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import RemoveFiltersForm from "@/fetures/settings/components/RemoveFiltersForm"
import { useSetting } from "../hooks/use-open-setting"
import FileName from "./FileName"

const SettingsPage = () => {
    const { isOpen, onClose } = useSetting()
  return (
    <Sheet open={isOpen} onOpenChange={onClose} >
      <SheetContent className="space-y-4 font-int overflow-visible">
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>
          </SheetDescription>
        </SheetHeader>
        <RemoveFiltersForm />
        <FileName />
      </SheetContent>
    </Sheet>
  )
}

export default SettingsPage