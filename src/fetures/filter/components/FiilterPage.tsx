import { Card, CardContent } from "@/components/ui/card"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useNewFilter } from "../hooks/use-new-filter"
import FilterForm from "./FilterForm"

const FiilterPage = () => {
    const {  onClose } = useNewFilter()
  return (
    <Sheet open={true} onOpenChange={onClose} >
      <SheetContent className="space-y-4 font-int">
        <SheetHeader>
          <SheetTitle>New Filter</SheetTitle>
          <SheetDescription>
            Create a new filter to filter your data.
          </SheetDescription>
        </SheetHeader>
        <Card>
          <CardContent className="py-4 overflow-hidden">
          <FilterForm />
          </CardContent>
        </Card>
      </SheetContent>
    </Sheet>
  )
}

export default FiilterPage