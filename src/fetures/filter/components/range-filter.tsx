import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

export function RangeFilter({ form, name, label }: { form: any, name: string, label: string }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name={`${name}.min`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Min {label}</FormLabel>
            <FormControl>
              <Input
                type="number"
                {...field}
                value={field.value ?? ""}
                onChange={(e) => {
                  const value = e.target.value === "" ? undefined : Number(e.target.value);
                  field.onChange(value);
                }}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`${name}.max`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Max {label}</FormLabel>
            <FormControl>
              <Input
                type="number"
                {...field}
                value={field.value ?? ""}
                onChange={(e) => {
                  const value = e.target.value === "" ? undefined : Number(e.target.value);
                  field.onChange(value);
                }}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}