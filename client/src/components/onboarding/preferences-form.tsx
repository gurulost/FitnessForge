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
import { Textarea } from "@/components/ui/textarea";
import { getEquipmentAccessOptions } from "@/lib/utils";

const formSchema = z.object({
  equipmentAccess: z.string({
    required_error: "Please select your equipment access",
  }),
  timeAvailability: z.string().optional(),
  dietaryPreferences: z.string().optional(),
  medicalConditions: z.string().optional(),
});

export type PreferencesValues = z.infer<typeof formSchema>;

interface PreferencesFormProps {
  onNext: (values: PreferencesValues) => void;
  onBack: () => void;
  defaultValues?: Partial<PreferencesValues>;
  isSubmitting?: boolean;
}

export function PreferencesForm({ onNext, onBack, defaultValues, isSubmitting }: PreferencesFormProps) {
  const equipmentOptions = getEquipmentAccessOptions();

  const form = useForm<PreferencesValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      equipmentAccess: defaultValues?.equipmentAccess || "",
      timeAvailability: defaultValues?.timeAvailability || "",
      dietaryPreferences: defaultValues?.dietaryPreferences || "",
      medicalConditions: defaultValues?.medicalConditions || "",
    },
  });

  function onSubmit(values: PreferencesValues) {
    onNext(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="equipmentAccess"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Equipment Access</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your equipment access" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {equipmentOptions.map((option) => (
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
          name="timeAvailability"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time Availability (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., Mornings before work, Evenings after 6pm, Weekends only"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dietaryPreferences"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dietary Preferences (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., Vegetarian, Low-carb, Intermittent fasting"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="medicalConditions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Medical Conditions or Limitations (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., Knee injury, Lower back pain, Asthma"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
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
          <Button 
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Profile..." : "Complete Setup"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
