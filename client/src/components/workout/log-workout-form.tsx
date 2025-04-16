import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { useState } from "react";
import { useCurrentUser } from "@/hooks/use-user";
import { useLogWorkout } from "@/hooks/use-workout";
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
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Workout name must be at least 3 characters.",
  }),
  date: z.string(),
  duration: z.coerce.number().min(1, {
    message: "Duration must be at least 1 minute.",
  }),
  exercises: z.array(
    z.object({
      name: z.string().min(1, { message: "Exercise name is required." }),
      sets: z.coerce.number().min(1, { message: "At least 1 set required." }),
      reps: z.string().min(1, { message: "Reps information is required." }),
      weight: z.string().optional(),
      notes: z.string().optional(),
    })
  ).min(1, { message: "Add at least one exercise." }),
  notes: z.string().optional(),
  rating: z.coerce.number().min(1).max(5).optional(),
});

export type LogWorkoutValues = z.infer<typeof formSchema>;

interface LogWorkoutFormProps {
  onSuccess: () => void;
}

export function LogWorkoutForm({ onSuccess }: LogWorkoutFormProps) {
  const { data: user } = useCurrentUser();
  const logWorkout = useLogWorkout();
  const { toast } = useToast();
  
  const form = useForm<LogWorkoutValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      date: new Date().toISOString().slice(0, 16),
      duration: 45,
      exercises: [
        { name: "", sets: 3, reps: "10", weight: "", notes: "" }
      ],
      notes: "",
      rating: 4,
    },
  });
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "exercises",
  });
  
  async function onSubmit(values: LogWorkoutValues) {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "User information not found. Please try again.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await logWorkout.mutateAsync({
        userId: user.id,
        name: values.name,
        date: new Date(values.date),
        duration: values.duration,
        notes: values.notes,
        rating: values.rating,
        exerciseData: values.exercises,
      });
      
      toast({
        title: "Workout logged!",
        description: "Your workout has been recorded successfully.",
      });
      
      onSuccess();
    } catch (error) {
      toast({
        title: "Error logging workout",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Workout Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Upper Body Strength" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date & Time</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (minutes)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <FormLabel className="text-base">Exercises</FormLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ name: "", sets: 3, reps: "10", weight: "", notes: "" })}
            >
              Add Exercise
            </Button>
          </div>
          
          {fields.map((field, index) => (
            <div key={field.id} className="border rounded-md p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">Exercise {index + 1}</h4>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(index)}
                  >
                    <i className="fas fa-trash text-red-500"></i>
                  </Button>
                )}
              </div>
              
              <div className="space-y-3">
                <FormField
                  control={form.control}
                  name={`exercises.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exercise Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Bench Press" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-3 gap-3">
                  <FormField
                    control={form.control}
                    name={`exercises.${index}.sets`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sets</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name={`exercises.${index}.reps`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reps</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 10 or 30 sec" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name={`exercises.${index}.weight`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight (optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 45 lbs" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name={`exercises.${index}.notes`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Increased weight from last time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}
          
          {form.formState.errors.exercises?.root && (
            <p className="text-sm text-red-500 mt-1">
              {form.formState.errors.exercises.root.message}
            </p>
          )}
        </div>
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Workout Notes (optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Any notes about how the workout felt, challenges, etc."
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
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Workout Rating</FormLabel>
              <FormControl>
                <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value?.toString()}>
                  <SelectTrigger>
                    <SelectValue placeholder="Rate your workout" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Very Poor</SelectItem>
                    <SelectItem value="2">2 - Poor</SelectItem>
                    <SelectItem value="3">3 - Average</SelectItem>
                    <SelectItem value="4">4 - Good</SelectItem>
                    <SelectItem value="5">5 - Excellent</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={logWorkout.isPending}
        >
          {logWorkout.isPending ? "Logging Workout..." : "Log Workout"}
        </Button>
      </form>
    </Form>
  );
}
