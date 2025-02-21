import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export function SelectFileter({ disabled }: { disabled?: boolean }) {
  return (
    <Select disabled={disabled}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a filter" />
      </SelectTrigger>
      <SelectContent className="w-full">
        <SelectGroup>
          <SelectLabel>Select Filter</SelectLabel>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="blueberry">Blueberry</SelectItem>
          <SelectItem value="grapes">Grapes</SelectItem>
          <SelectItem value="pineapple">Pineapple</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
