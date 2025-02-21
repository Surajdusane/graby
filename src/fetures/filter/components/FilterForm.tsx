import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { DateFilter } from "./date-filter"
import { RangeFilter } from "./range-filter"


const formSchema = z.object({
  dateFilter: z.object({
    startingDate: z.string().optional(),
    endingDate: z.string().optional(),
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
    minimumduration: z.string().optional(),
    maximumduration: z.string().optional(),
  }),
  ignoreCarouselViews: z.boolean().optional(),
})

function FilterForm() {
  const [enabledFields, setEnabledFields] = useState({
    dateFilter: false,
    likesFilter: false,
    viewsFilter: false,
    commentsFilter: false,
    durationFilter: false,
    ignoreCarouselViews: false,
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dateFilter: {},
      likesFilter: {},
      viewsFilter: {},
      commentsFilter: {},
      durationFilter: {},
      ignoreCarouselViews: false,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  const toggleField = (field: keyof typeof enabledFields) => {
    setEnabledFields((prev) => ({ ...prev, [field]: !prev[field] }))
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 overflow-hidden">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className=" font-medium">Date Filter</h3>
            <Switch checked={enabledFields.dateFilter} onCheckedChange={() => toggleField("dateFilter")} />
          </div>
          {enabledFields.dateFilter && <DateFilter form={form} />}
        </div>
 
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className=" font-medium">Likes Filter</h3>
            <Switch checked={enabledFields.likesFilter} onCheckedChange={() => toggleField("likesFilter")} />
          </div>
          {enabledFields.likesFilter && <RangeFilter form={form} name="likesFilter" label="Likes" />}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className=" font-medium">Views Filter</h3>
            <Switch checked={enabledFields.viewsFilter} onCheckedChange={() => toggleField("viewsFilter")} />
          </div>
          {enabledFields.viewsFilter && <RangeFilter form={form} name="viewsFilter" label="Views" />}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className=" font-medium">Comments Filter</h3>
            <Switch checked={enabledFields.commentsFilter} onCheckedChange={() => toggleField("commentsFilter")} />
          </div>
          {enabledFields.commentsFilter && <RangeFilter form={form} name="commentsFilter" label="Comments" />}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className=" font-medium">Duration Filter</h3>
            <Switch checked={enabledFields.durationFilter} onCheckedChange={() => toggleField("durationFilter")} />
          </div>
          {enabledFields.durationFilter && <RangeFilter form={form} name="commentsFilter" label="Duration" />}
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="ignore-carousel-views"
            checked={enabledFields.ignoreCarouselViews}
            onCheckedChange={() => toggleField("ignoreCarouselViews")}
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
  )
}

export default FilterForm