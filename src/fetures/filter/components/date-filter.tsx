// src/components/DateFilter.tsx
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DynamicRange } from "./DynamicRange";

export function DateFilter({ form, name }: { form: any; name: string }) {
  return (
    <div className="flex flex-col justify-center items-start gap-4 w-full">
      <FormField
        control={form.control}
        name={`${name}`}
        render={({ field }) => (
          <FormItem className="w-full">
            <FormControl>
              <Tabs defaultValue="dr">
                <div className="w-full flex justify-center items-center mb-5">
                  <TabsList>
                    <TabsTrigger value="dr">Dynamic Range</TabsTrigger>
                    <TabsTrigger value="cr">Custom Range</TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="dr">
                  <DynamicRange
                    selected={field.value?.dynamicRange} // Pass the dynamic range value
                    onSelect={(value: string) => {
                      // Update the form value with the dynamic range
                      form.setValue(name, { dynamicRange: value });
                    }}
                  />
                </TabsContent>
                <TabsContent value="cr">
                <DateRangePicker
                    selected={{
                      from: field.value?.startingDate
                        ? new Date(field.value.startingDate)
                        : undefined,
                      to: field.value?.endingDate
                        ? new Date(field.value.endingDate)
                        : undefined,
                    }}
                    onSelect={(dateRange) => {
                      // Update the form value with the custom date range
                      form.setValue(name, {
                        startingDate: dateRange?.from?.toISOString(),
                        endingDate: dateRange?.to?.toISOString(),
                      });
                    }}
                    placeholder="Select a date range"
                    className="w-full"
                  />
                </TabsContent>
              </Tabs>
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}