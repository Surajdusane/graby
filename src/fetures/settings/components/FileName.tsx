import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import MultipleSelector, { Option } from "@/components/ui/multiselect";
import { useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useSetting } from "../hooks/use-open-setting";

type FormData = {
  NamingSchema: Option[];
};

const FileName = () => {
  const { onClose } = useSetting();
  const { control, handleSubmit, reset } = useForm<FormData>();

  const NameOption: Option[] = [
    { label: "Date", value: "date" },
    { label: "ID", value: "id" },
    { label: "Code", value: "code" },
    { label: "Views", value: "views" },
    { label: "Comments", value: "comments" },
    { label: "Likes", value: "likes" },
    { label: "Duration", value: "duration" }
  ];

  // Check local storage on component mount and set the default selected values
  useEffect(() => {
    chrome.storage.local.get('namingSchema', (result) => {
      const storedNamingSchema = result.namingSchema;

      if (storedNamingSchema) {
        // Convert the stored schema into an array of selected options
        const selectedOptions = NameOption.filter(option => storedNamingSchema[option.value]);
        reset({ NamingSchema: selectedOptions });
      }
    });
  }, [reset]);
  
  const onSubmit: SubmitHandler<FormData> = (data) => {
    // Map selected options to an object with true/false values
    const mappedData = NameOption.reduce((acc, option) => {
      acc[option.value] = data.NamingSchema.some((selected) => selected.value === option.value);
      return acc;
    }, {} as Record<string, boolean>);

    chrome.storage.local.set({ namingSchema: mappedData }, () => {
      toast.success("Name format updated successfully!");
      reset();
      onClose();
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="*:not-first:mt-2">
        <Label>Select Filters to Delete</Label>
        <Controller
          control={control}
          name="NamingSchema"
          render={({ field }) => (
            <MultipleSelector
              {...field}
              defaultOptions={NameOption}
              placeholder="Select filters to delete"
              emptyIndicator={<p className="text-center text-sm">No filters found</p>}
              onChange={(selected) => field.onChange(selected)}
              className="ring-0 mt-2 ring-transparent focus:ring-0 focus-visible:ring-0"
            />
          )}
        />
      </div>
      <Button type="submit">Update</Button>
    </form>
  );
};

export default FileName;
