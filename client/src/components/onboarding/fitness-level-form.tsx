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
import { Slider } from "@/components/ui/slider";
import { getFitnessLevelOptions, getWorkoutTypeOptions } from "@/lib/utils";

const formSchema = z.object({
  fitnessLevel: z.string({
    required_error: "Please select your fitness level",
  }),
  workoutFrequency: z.number().min(1).max(7),
  workoutDuration: z.number().min(15).max(120),
  preferredWorkoutType: z.string({
    required_error: "Please select your preferred workout type",
  }),
});

export type FitnessLevelValues = z.infer<typeof formSchema>;

interface FitnessLevelFormProps {
  onNext: (values: FitnessLevelValues) => void;
  onBack: () => void;
  defaultValues?: Partial<FitnessLevelValues>;
}

export function FitnessLevelForm({ onNext, onBack, defaultValues }: FitnessLevelFormProps) {
  const fitnessLevelOptions = getFitnessLevelOptions();
  const workoutTypeOptions = getWorkoutTypeOptions();

  const form = useForm<FitnessLevelValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fitnessLevel: defaultValues?.fitnessLevel || "",
      workoutFrequency: defaultValues?.workoutFrequency || 3,
      workoutDuration: defaultValues?.workoutDuration || 45,
      preferredWorkoutType: defaultValues?.preferredWorkoutType || "",
    },
  });

  function onSubmit(values: FitnessLevelValues) {
    onNext(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="fitnessLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Fitness Level</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your fitness level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {fitnessLevelOptions.map((option) => (
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
          name="workoutFrequency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Workout Frequency (days per week)</FormLabel>
              <div className="flex flex-col space-y-2">
                <FormControl>
                  <Slider
                    min={1}
                    max={7}
                    step={1}
                    defaultValue={[field.value]}
                    onValueChange={(vals) => field.onChange(vals[0])}
                  />
                </FormControl>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>1</span>
                  <span>2</span>
                  <span>3</span>
                  <span>4</span>
                  <span>5</span>
                  <span>6</span>
                  <span>7</span>
                </div>
                <div className="text-center font-medium">
                  {field.value} {field.value === 1 ? 'day' : 'days'} per week
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="workoutDuration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Workout Duration (minutes)</FormLabel>
              <div className="flex flex-col space-y-2">
                <FormControl>
                  <Slider
                    min={15}
                    max={120}
                    step={5}
                    defaultValue={[field.value]}
                    onValueChange={(vals) => field.onChange(vals[0])}
                  />
                </FormControl>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>15</span>
                  <span>30</span>
                  <span>45</span>
                  <span>60</span>
                  <span>75</span>
                  <span>90</span>
                  <span>105</span>
                  <span>120</span>
                </div>
                <div className="text-center font-medium">
                  {field.value} minutes
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="preferredWorkoutType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred Workout Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your preferred workout type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {workoutTypeOptions.map((option) => (
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
