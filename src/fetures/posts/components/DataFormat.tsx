import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { useDataTypeStore } from "../Hooks/use-data-type";

export function DataFormat() {
    const { data, onChange } = useDataTypeStore();
    
  return (
    <Select defaultValue={data} onValueChange={onChange}>
      <SelectTrigger >
        <SelectValue placeholder={data} />
      </SelectTrigger>
      <SelectContent >
          <SelectItem value="CSV">CSV</SelectItem>
          <SelectItem value="JSON">JSON</SelectItem>
      </SelectContent>
    </Select>
  )
}
