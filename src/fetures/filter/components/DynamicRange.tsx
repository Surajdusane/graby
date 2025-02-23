// src/components/DynamicRange.tsx
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  
  export function DynamicRange({
    selected,
    onSelect,
  }: {
    selected: string;
    onSelect: (value: string) => void;
  }) {
    return (
      <Select
        value={selected} // Pass the selected value
        onValueChange={(value) => {
          onSelect(value); // Call onSelect with the selected value
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a dynamic range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="last7">Last 7 days</SelectItem>
          <SelectItem value="last30">Last 30 days</SelectItem>
          <SelectItem value="last6m">Last 6 months</SelectItem>
          <SelectItem value="lastyear">Last year</SelectItem>
        </SelectContent>
      </Select>
    );
  }