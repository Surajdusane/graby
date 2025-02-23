import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFilterState } from "@/fetures/posts/Hooks/useFilterState";
import useFilterNames from "@/hooks/useFilterNames";

export function SelectFilter({ disabled }: { disabled?: boolean }) {
  const { filterNames, loading, error } = useFilterNames();
  const { onChange } = useFilterState();

  return (
    <div className="relative">
      {/* Error Banner */}
      {error && (
        <div
          role="alert"
          className="absolute top-0 left-0 w-full bg-red-500 text-white px-4 py-2 text-sm rounded-t-md"
        >
          Error: {error.message}
        </div>
      )}

      <Select onValueChange={onChange} disabled={disabled || loading}>
        <SelectTrigger className="w-full">
          <SelectValue
            placeholder={
              loading
                ? "Loading filters..."
                : error
                ? "Error loading filters"
                : "Select a filter"
            }
          />
        </SelectTrigger>
        <SelectContent className="w-full">
          <SelectGroup>
            <SelectLabel>Filters</SelectLabel>

            {/* Empty State */}
            {filterNames.length === 0 && !loading && !error && (
              <div className="px-2 py-1 text-sm text-gray-500">
                No filters available. Please create a new filter.
              </div>
            )}

            {/* Render Filter Names */}
            {filterNames.map((name) => (
              <SelectItem key={name} value={name}>
                {name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}