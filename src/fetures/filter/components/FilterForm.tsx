import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { DateFilter } from "./date-filter";
import { RangeFilter } from "./range-filter";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { CircleCheckIcon } from "lucide-react";
import { useNewFilter } from "../hooks/use-new-filter";
import { useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  filterName: z.string().min(1, {
    message: "Filter name is required",
  }),
  dateFilter: z.object({
      startingDate: z.string().optional(),
      endingDate: z.string().optional(),
      dynamicRange: z.string().optional(),
    }),
  likesFilter: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
  }),
  viewsFilter: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
  }),
  commentsFilter: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
  }),
  durationFilter: z.object({
    minimumduration: z.number().optional(),
    maximumduration: z.number().optional(),
  }),
  ignoreCarouselViews: z.boolean().optional(),
});

function FilterForm() {
  const { onClose } = useNewFilter();
  const [enabledFields, setEnabledFields] = useState({
    dateFilter: false,
    likesFilter: false,
    viewsFilter: false,
    commentsFilter: false,
    durationFilter: false,
    ignoreCarouselViews: false,
  });

  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dateFilter: {}, // Matches the first schema in the union
      likesFilter: {},
      viewsFilter: {},
      commentsFilter: {},
      durationFilter: {},
      ignoreCarouselViews: false,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { filterName, ...filters } = values;

    if (filterName) {
      // Retrieve existing filters from storage
      chrome.storage.local.get("filter", (result) => {
        try {
          // Extract the existing filters (default to an empty object if none exist)
          const previousFilters = result.filter || {};

          // Merge the new filter with the existing filters
          const updatedFilters = {
            ...previousFilters,
            [filterName]: filters,
          };

          // Save the updated filters back to storage
          chrome.storage.local.set({ filter: updatedFilters }, () => {
            if (chrome.runtime.lastError) {
              throw new Error(chrome.runtime.lastError.message);
            }

            // Show success toast
            toast(
              <div className="flex gap-2 w-full justify-start">
                <p className="grow text-sm">
                  <CircleCheckIcon
                    className="me-3 -mt-0.5 inline-flex text-emerald-500"
                    size={16}
                    aria-hidden="true"
                  />
                  Filter created successfully!
                </p>
              </div>
            );

            // Close the modal or form
            queryClient.invalidateQueries({ queryKey: ["filterNames"] });
            onClose();
          });
        } catch (error: any) {
          // Handle errors
          console.error("Error saving filter:", error.message);
          toast.error(`Failed to save filter: ${error.message}`);
        }
      });
    }
  }

  const toggleField = (field: keyof typeof enabledFields) => {
    setEnabledFields((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5 overflow-hidden px-2"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className=" font-medium">Filter Name</h3>
          </div>
          <Input {...form.register("filterName")} />
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className=" font-medium">Date Filter</h3>
            <Switch
              checked={enabledFields.dateFilter}
              onCheckedChange={() => toggleField("dateFilter")}
            />
          </div>
          {enabledFields.dateFilter && (
            <DateFilter form={form} name="dateFilter" />
          )}
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className=" font-medium">Likes Filter</h3>
            <Switch
              checked={enabledFields.likesFilter}
              onCheckedChange={() => toggleField("likesFilter")}
            />
          </div>
          {enabledFields.likesFilter && (
            <RangeFilter form={form} name="likesFilter" label="Likes" />
          )}
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className=" font-medium">Views Filter</h3>
            <Switch
              checked={enabledFields.viewsFilter}
              onCheckedChange={() => toggleField("viewsFilter")}
            />
          </div>
          {enabledFields.viewsFilter && (
            <RangeFilter form={form} name="viewsFilter" label="Views" />
          )}
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className=" font-medium">Comments Filter</h3>
            <Switch
              checked={enabledFields.commentsFilter}
              onCheckedChange={() => toggleField("commentsFilter")}
            />
          </div>
          {enabledFields.commentsFilter && (
            <RangeFilter form={form} name="commentsFilter" label="Comments" />
          )}
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className=" font-medium">Duration Filter</h3>
            <Switch
              checked={enabledFields.durationFilter}
              onCheckedChange={() => toggleField("durationFilter")}
            />
          </div>
          {enabledFields.durationFilter && (
            <RangeFilter form={form} name="durationFilter" label="Duration" />
          )}
        </div>
        <div className="flex items-center space-x-2">
          <FormField
            control={form.control}
            name="ignoreCarouselViews"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Switch
                    id="ignore-carousel-views"
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked); // Update the form value when the switch is toggled
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <label
            htmlFor="ignore-carousel-views"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Ignore Carousel Views
          </label>
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

export default FilterForm;