import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useFilterStore } from "@/Store/filter";
import { Filter } from "lucide-react";
import { useId } from "react";

export default function SwitchCard() {
  const id = useId();
  const { checked, onChange } = useFilterStore();
  return (
    <div className="relative flex w-full items-start gap-2 rounded-lg border border-input p-4 shadow-sm shadow-black/5 has-[[data-state=checked]]:border-ring">
      <Switch
        id={id}
        className="order-1 h-4 w-6 after:absolute after:inset-0 [&_span]:size-3 [&_span]:data-[state=checked]:translate-x-2 rtl:[&_span]:data-[state=checked]:-translate-x-2"
        aria-describedby={`${id}-description`}
        checked={checked}
        onClick={onChange}
      />
      <div className="flex grow items-center gap-3">
      <Filter size={35} strokeWidth={2} className="opacity-60" aria-hidden="true"/>
        <div className="grid grow gap-2">
          <Label htmlFor={id}>
            Add Filter
          </Label>
          <p id={`${id}-description`} className="text-xs text-muted-foreground">
            Add custom filters to refine your results
          </p>
        </div>
      </div>
    </div>
  );
}
