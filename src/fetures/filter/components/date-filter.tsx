import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { DateRangePicker } from "@/components/ui/date-range-picker"; // Import the DateRangePicker

export function DateFilter({ form }: { form: any }) {
  return (
    <div className="flex flex-col justify-center items-start gap-4 w-full">
      <FormField
        control={form.control}
        name="dateFilter.dateRange"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel>Date Range</FormLabel>
            <FormControl>
              <DateRangePicker
                selected={field.value}
                onSelect={field.onChange}
                placeholder="Select a date range"
                className="w-full"
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}