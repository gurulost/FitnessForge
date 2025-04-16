import { useCurrentUser } from "@/hooks/use-user";
import { useUserProfile, useUpdateUserProfile } from "@/hooks/use-user";
import { useFitnessQuestion } from "@/hooks/use-user";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MetricsCard } from "@/components/profile/metrics-card";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";

const questionSchema = z.object({
  question: z.string().min(10, {
    message: "Question must be at least 10 characters.",
  }),
});

export default function Profile() {
  const { data: user } = useCurrentUser();
  const { data: profile, isLoading } = useUserProfile(user?.id);
  const updateProfile = useUpdateUserProfile();
  const askQuestion = useFitnessQuestion(user?.id);
  const { toast } = useToast();
  
  const [editMode, setEditMode] = useState(false);
  const [askingQuestion, setAskingQuestion] = useState(false);
  const [questionResponse, setQuestionResponse] = useState<string | null>(null);
  
  const form = useForm({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      question: "",
    },
  });
  
  const handleUpdateProfile = () => {
    setEditMode(true);
  };
  
  const handleAskQuestion = async (data: { question: string }) => {
    try {
      const response = await askQuestion.mutateAsync(data.question);
      setQuestionResponse(response.answer);
      form.reset();
    } catch (error) {
      toast({
        title: "Error asking question",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };
  
  if (isLoading) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Profile</h1>
        <div className="flex justify-center py-12">
          <p>Loading your profile...</p>
        </div>
      </section>
    );
  }
  
  if (!profile) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Profile</h1>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Profile not found. Please complete the onboarding process.
          </AlertDescription>
        </Alert>
      </section>
    );
  }
  
  return (
    <section className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Profile</h1>
      
      <Card className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="p-6 md:w-1/3 bg-gradient-to-br from-primary to-blue-700 text-white">
            <div className="flex flex-col items-center">
              <img 
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80" 
                alt="Profile" 
                className="w-32 h-32 rounded-full border-4 border-white shadow-md"
              />
              <h2 className="mt-4 text-xl font-bold">{user?.firstName || user?.username}</h2>
              <p className="text-blue-100">Joined {user?.createdAt ? formatDate(user.createdAt) : "Recently"}</p>
              
              <div className="mt-6 w-full">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-blue-100">Overall Progress</span>
                  <span className="text-sm font-medium text-blue-100">65%</span>
                </div>
                <div className="w-full bg-blue-600 rounded-full h-2.5">
                  <div className="bg-white h-2.5 rounded-full" style={{ width: "65%" }}></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6 md:w-2/3">
            <h3 className="text-lg font-medium mb-4">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProfileField label="Age" value={profile.age} />
              <ProfileField label="Sex" value={profile.sex} />
              <ProfileField label="Height" value={profile.heightFeet ? `${profile.heightFeet}'${profile.heightInches || 0}"` : undefined} />
              <ProfileField label="Weight" value={profile.weight ? `${profile.weight} lbs` : undefined} />
              <ProfileField label="Fitness Level" value={profile.fitnessLevel} />
              <ProfileField label="Primary Goal" value={profile.primaryGoal} />
            </div>
            
            <div className="mt-6 flex">
              <Button
                onClick={handleUpdateProfile}
                className="mr-3"
              >
                Edit Profile
              </Button>
              <Button
                variant="outline"
                onClick={() => setAskingQuestion(true)}
              >
                Ask Fitness Question
              </Button>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Health Metrics */}
      <MetricsCard profile={profile} />
      
      {/* Profile Edit Dialog */}
      <Dialog open={editMode} onOpenChange={setEditMode}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          
          <p className="text-gray-500 mb-4">
            Profile editing functionality would be implemented here.
          </p>
          
          <div className="flex justify-end">
            <Button onClick={() => setEditMode(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Ask Question Dialog */}
      <Dialog open={askingQuestion} onOpenChange={setAskingQuestion}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Ask a Fitness Question</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAskQuestion)} className="space-y-4">
              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Question</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="e.g., What's the best way to improve my bench press?"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                disabled={askQuestion.isPending}
                className="w-full"
              >
                {askQuestion.isPending ? "Asking..." : "Ask Question"}
              </Button>
            </form>
          </Form>
          
          {questionResponse && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium mb-2">Answer:</h3>
              <p className="text-gray-700">{questionResponse}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

interface ProfileFieldProps {
  label: string;
  value?: string | number;
}

function ProfileField({ label, value }: ProfileFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="bg-gray-50 px-3 py-2 rounded-md text-gray-900">
        {value || "Not set"}
      </div>
    </div>
  );
}
