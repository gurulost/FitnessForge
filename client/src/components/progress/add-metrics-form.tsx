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
import { useAddProgressMetrics } from "@/hooks/use-progress";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  weight: z.coerce.number().min(50, {
    message: "Weight must be at least 50 lbs.",
  }).max(500, {
    message: "Weight must be less than 500 lbs.",
  }).optional(),
  bodyFat: z.coerce.number().min(1, {
    message: "Body fat must be at least 1%.",
  }).max(50, {
    message: "Body fat must be less than 50%.",
  }).optional(),
  chestMeasurement: z.coerce.number().min(20, {
    message: "Chest measurement must be at least 20 inches.",
  }).max(70, {
    message: "Chest measurement must be less than 70 inches.",
  }).optional(),
  waistMeasurement: z.coerce.number().min(20, {
    message: "Waist measurement must be at least 20 inches.",
  }).max(70, {
    message: "Waist measurement must be less than 70 inches.",
  }).optional(),
  hipsMeasurement: z.coerce.number().min(20, {
    message: "Hips measurement must be at least 20 inches.",
  }).max(70, {
    message: "Hips measurement must be less than 70 inches.",
  }).optional(),
  armsMeasurement: z.coerce.number().min(5, {
    message: "Arms measurement must be at least 5 inches.",
  }).max(30, {
    message: "Arms measurement must be less than 30 inches.",
  }).optional(),
  thighsMeasurement: z.coerce.number().min(10, {
    message: "Thighs measurement must be at least 10 inches.",
  }).max(40, {
    message: "Thighs measurement must be less than 40 inches.",
  }).optional(),
}).refine(data => {
  // At least one field must be provided
  return Object.values(data).some(value => value !== undefined);
}, {
  message: "At least one measurement must be provided",
  path: ["weight"],
});

interface AddMetricsFormProps {
  userId?: number;
  onSuccess: () => void;
}

export function AddMetricsForm({ userId, onSuccess }: AddMetricsFormProps) {
  const addMetrics = useAddProgressMetrics();
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      weight: undefined,
      bodyFat: undefined,
      chestMeasurement: undefined,
      waistMeasurement: undefined,
      hipsMeasurement: undefined,
      armsMeasurement: undefined,
      thighsMeasurement: undefined,
    },
  });
  
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!userId) {
      toast({
        title: "Error",
        description: "User ID is missing. Please try again later.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await addMetrics.mutateAsync({
        userId,
        weight: values.weight,
        bodyFat: values.bodyFat,
        chestMeasurement: values.chestMeasurement,
        waistMeasurement: values.waistMeasurement,
        hipsMeasurement: values.hipsMeasurement,
        armsMeasurement: values.armsMeasurement,
        thighsMeasurement: values.thighsMeasurement,
      });
      
      toast({
        title: "Measurements added",
        description: "Your progress metrics have been recorded successfully.",
      });
      
      onSuccess();
    } catch (error) {
      toast({
        title: "Error adding metrics",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weight (lbs)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 170" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="bodyFat"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Body Fat (%)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 15" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="chestMeasurement"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chest (inches)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 42" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="waistMeasurement"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Waist (inches)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 34" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="hipsMeasurement"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hips (inches)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 40" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="armsMeasurement"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Arms (inches)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 15" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="thighsMeasurement"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thighs (inches)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g., 22" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full mt-2"
          disabled={addMetrics.isPending}
        >
          {addMetrics.isPending ? "Saving..." : "Save Measurements"}
        </Button>
      </form>
    </Form>
  );
}
