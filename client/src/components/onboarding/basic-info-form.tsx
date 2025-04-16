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
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const formSchema = z.object({
  age: z.coerce
    .number()
    .min(13, { message: "You must be at least 13 years old" })
    .max(120, { message: "Please enter a valid age" }),
  sex: z.enum(["male", "female", "other"], {
    required_error: "Please select your biological sex",
  }),
  heightFeet: z.coerce
    .number()
    .min(1, { message: "Please enter a valid height" })
    .max(9, { message: "Please enter a valid height" }),
  heightInches: z.coerce
    .number()
    .min(0, { message: "Please enter a valid height" })
    .max(11, { message: "Please enter a valid height" }),
  weight: z.coerce
    .number()
    .min(50, { message: "Please enter a valid weight" })
    .max(500, { message: "Please enter a valid weight" }),
});

export type BasicInfoValues = z.infer<typeof formSchema>;

interface BasicInfoFormProps {
  onNext: (values: BasicInfoValues) => void;
  defaultValues?: Partial<BasicInfoValues>;
}

export function BasicInfoForm({ onNext, defaultValues }: BasicInfoFormProps) {
  const form = useForm<BasicInfoValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: defaultValues?.age || undefined,
      sex: defaultValues?.sex as any || undefined,
      heightFeet: defaultValues?.heightFeet || undefined,
      heightInches: defaultValues?.heightInches || 0,
      weight: defaultValues?.weight || undefined,
    },
  });

  function onSubmit(values: BasicInfoValues) {
    onNext(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Age</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter your age"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sex"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Biological Sex</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-4"
                >
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="male" />
                    </FormControl>
                    <FormLabel className="cursor-pointer">Male</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="female" />
                    </FormControl>
                    <FormLabel className="cursor-pointer">Female</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="other" />
                    </FormControl>
                    <FormLabel className="cursor-pointer">Other</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="heightFeet"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Height (feet)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Feet"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="heightInches"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Height (inches)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Inches"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="weight"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Weight (lbs)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter weight"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-4">
          <Button 
            type="submit" 
            className="bg-primary text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Continue
          </Button>
        </div>
      </form>
    </Form>
  );
}
