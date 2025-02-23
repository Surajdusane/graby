import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useNewFilter } from "../hooks/use-new-filter"
import FilterForm from "./FilterForm"

const FiilterPage = () => {
    const { isOpen, onClose } = useNewFilter()
  return (
    <Sheet open={isOpen} onOpenChange={onClose} >
      <SheetContent className="space-y-4 font-int overflow-visible">
        <SheetHeader>
          <SheetTitle>New Filter</SheetTitle>
          <SheetDescription>
            Create a new filter to filter your data.
          </SheetDescription>
        </SheetHeader>
        <Card>
        <ScrollArea className="h-[65vh] w-full rounded-md border">
          <CardContent className="py-4">
          <FilterForm />
          </CardContent>
          </ScrollArea>
        </Card>
      </SheetContent>
    </Sheet>
  )
}

export default FiilterPage