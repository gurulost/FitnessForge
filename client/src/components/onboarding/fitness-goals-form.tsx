import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { getGoalOptions } from "@/lib/utils";

const formSchema = z.object({
  primaryGoal: z.string({
    required_error: "Please select your primary fitness goal",
  }),
  secondaryGoals: z.array(z.string()).optional(),
  targetWeight: z.coerce
    .number()
    .min(50, { message: "Please enter a valid target weight" })
    .max(500, { message: "Please enter a valid target weight" })
    .optional(),
});

export type FitnessGoalsValues = z.infer<typeof formSchema>;

interface FitnessGoalsFormProps {
  onNext: (values: FitnessGoalsValues) => void;
  onBack: () => void;
  defaultValues?: Partial<FitnessGoalsValues>;
}

export function FitnessGoalsForm({ onNext, onBack, defaultValues }: FitnessGoalsFormProps) {
  const goalOptions = getGoalOptions();
  const secondaryGoalOptions = goalOptions.filter(
    (option) => option.value !== defaultValues?.primaryGoal
  );

  const form = useForm<FitnessGoalsValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      primaryGoal: defaultValues?.primaryGoal || "",
      secondaryGoals: defaultValues?.secondaryGoals || [],
      targetWeight: defaultValues?.targetWeight || undefined,
    },
  });

  function onSubmit(values: FitnessGoalsValues) {
    onNext(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="primaryGoal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Primary Fitness Goal</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your main fitness goal" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {goalOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="secondaryGoals"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel>Secondary Goals (Optional)</FormLabel>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {secondaryGoalOptions.map((item) => (
                  <FormField
                    key={item.value}
                    control={form.control}
                    name="secondaryGoals"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item.value}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item.value)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value || [], item.value])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== item.value
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">
                            {item.label}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch("primaryGoal") === "weight_loss" && (
          <FormField
            control={form.control}
            name="targetWeight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Target Weight (lbs)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter your target weight"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="flex justify-between pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
          >
            Back
          </Button>
          <Button type="submit">
            Continue
          </Button>
        </div>
      </form>
    </Form>
  );
}
