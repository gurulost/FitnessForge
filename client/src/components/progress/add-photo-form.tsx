import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
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
import { useAddProgressPhoto } from "@/hooks/use-progress";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const formSchema = z.object({
  photoUrl: z.string().url({
    message: "Please enter a valid image URL.",
  }),
  caption: z.string().max(100, {
    message: "Caption must be 100 characters or less.",
  }).optional(),
});

interface AddPhotoFormProps {
  userId?: number;
  onSuccess: () => void;
}

export function AddPhotoForm({ userId, onSuccess }: AddPhotoFormProps) {
  const addPhoto = useAddProgressPhoto();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      photoUrl: "",
      caption: "",
    },
  });
  
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!userId) {
      setError("User ID is missing. Please try again later.");
      return;
    }
    
    try {
      await addPhoto.mutateAsync({
        userId,
        photoUrl: values.photoUrl,
        caption: values.caption,
      });
      
      toast({
        title: "Photo added",
        description: "Your progress photo has been added successfully.",
      });
      
      onSuccess();
    } catch (error) {
      setError("Failed to add photo. Please try again later.");
    }
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <FormField
          control={form.control}
          name="photoUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Photo URL</FormLabel>
              <FormControl>
                <Input placeholder="Enter image URL" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Caption (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="e.g., Week 4 Progress"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="text-sm text-gray-500 mb-4">
          <p>For this demo, please use a direct URL to an image file.</p>
          <p>In a production app, this would be replaced with a file upload feature.</p>
        </div>
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={addPhoto.isPending}
        >
          {addPhoto.isPending ? "Adding..." : "Add Photo"}
        </Button>
      </form>
    </Form>
  );
}
