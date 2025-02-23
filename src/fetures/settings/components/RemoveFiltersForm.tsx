import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import MultipleSelector, { Option } from "@/components/ui/multiselect";
import { toast } from "sonner";
import useFilterNames from "@/hooks/useFilterNames";
import { useQueryClient } from "@tanstack/react-query";
import { useSetting } from "@/fetures/settings/hooks/use-open-setting";

// Define the form data type
type FormData = {
  selectedFilters: Option[];
};

export default function RemoveFiltersForm() {
  const queryClient = useQueryClient();
  const { onClose } = useSetting();
  const { control, handleSubmit, reset } = useForm<FormData>();
  const { filterNames, loading, error } = useFilterNames(); // Fetch filter names

  // Convert filter names to the format expected by the multiselect component
  const filterOptions: Option[] = filterNames.map((name) => ({
    label: name,
    value: name,
  }));

  // Define the onSubmit function with the correct type
  const onSubmit: SubmitHandler<FormData> = (data) => {
    const selectedFilterNames = data.selectedFilters.map((filter) => filter.value);

    // Remove selected filters from local storage
    chrome.storage.local.get("filter", (result) => {
      const existingFilters = result.filter || {};

      // Filter out the selected filters
      const updatedFilters = Object.keys(existingFilters).reduce((acc, key) => {
        if (!selectedFilterNames.includes(key)) {
          acc[key] = existingFilters[key];
        }
        return acc;
      }, {} as Record<string, any>);

      // Save the updated filters back to local storage
      chrome.storage.local.set({ filter: updatedFilters }, () => {
        if (chrome.runtime.lastError) {
          toast.error("Failed to remove filters. Please try again.");
          return;
        }

        // Show success toast
        queryClient.invalidateQueries({ queryKey: ["filterNames"] });
        toast.success("Selected filters removed successfully!");

        // Reset the form after successful submission
        reset();
        onClose();
      });
    });
  };

  if (loading) {
    return <p>Loading filter names...</p>;
  }

  if (error) {
    return <p>Error fetching filter names: {error.message}</p>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="*:not-first:mt-2">
        <Label >Select Filters to Delete</Label>
        <Controller
          control={control}
          name="selectedFilters"
          render={({ field }) => (
            <MultipleSelector
              {...field}
              defaultOptions={filterOptions}
              placeholder="Select filters to delete"
              emptyIndicator={<p className="text-center text-sm">No filters found</p>}
              onChange={(selected) => field.onChange(selected)}
              className="ring-0 mt-2 ring-transparent focus:ring-0 focus-visible:ring-0"
            />
          )}
        />
      </div>
      <Button variant={"destructive"} type="submit">Delete</Button>
    </form>
  );
}
