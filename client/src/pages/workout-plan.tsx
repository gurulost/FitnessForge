import { useCurrentUser } from "@/hooks/use-user";
import { useUserProfile } from "@/hooks/use-user";
import { useWorkoutPlans, useGenerateWorkoutPlan } from "@/hooks/use-workout";
import { getEquipmentList } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorkoutDayCard } from "@/components/workout/workout-day-card";
import { EquipmentCard } from "@/components/workout/equipment-card";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function WorkoutPlan() {
  const { data: user } = useCurrentUser();
  const { data: profile } = useUserProfile(user?.id);
  const { data: workoutPlans = [], isLoading } = useWorkoutPlans(user?.id);
  const generatePlan = useGenerateWorkoutPlan();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Get the most recent workout plan
  const currentPlan = workoutPlans[0];
  
  // Equipment recommendations
  const equipmentItems = getEquipmentList();
  
  // Handle generate plan
  const handleGeneratePlan = async () => {
    if (!user?.id) return;
    
    try {
      toast({
        title: "Generating your personalized workout plan",
        description: "This may take a moment as our AI analyzes your profile...",
      });
      
      await generatePlan.mutateAsync(user.id);
      
      toast({
        title: "Workout plan created!",
        description: "Your personalized workout plan is now ready.",
      });
    } catch (error) {
      toast({
        title: "Error generating plan",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };
  
  if (isLoading) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Personalized Workout Plan</h1>
        <div className="flex justify-center py-12">
          <p>Loading your workout plan...</p>
        </div>
      </section>
    );
  }
  
  return (
    <section className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Personalized Workout Plan</h1>
      
      {!currentPlan ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">No Workout Plan Yet</h2>
          <p className="text-gray-600 mb-6">
            Let's create a personalized workout plan based on your fitness profile and goals.
          </p>
          <Button 
            onClick={handleGeneratePlan}
            disabled={generatePlan.isPending || !profile}
          >
            {generatePlan.isPending ? "Generating..." : "Generate My Workout Plan"}
          </Button>
          
          {!profile && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please complete your profile first to generate a personalized workout plan.
              </AlertDescription>
            </Alert>
          )}
        </div>
      ) : (
        <>
          {/* Plan Overview */}
          <Card className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
              <div className="mb-4 md:mb-0">
                <h2 className="text-xl font-semibold">{currentPlan.name}</h2>
                <p className="text-gray-600">
                  Customized for your goals: <span className="font-medium">{profile?.primaryGoal}</span>
                </p>
              </div>
              <div className="flex space-x-3">
                <Button onClick={() => window.print()}>
                  <i className="fas fa-download mr-2"></i> Export
                </Button>
                <Button variant="outline" onClick={handleGeneratePlan} disabled={generatePlan.isPending}>
                  <i className="fas fa-edit mr-2"></i> {generatePlan.isPending ? "Updating..." : "Refresh"}
                </Button>
              </div>
            </div>
            
            {currentPlan.aiFeedback && (
              <div className="mt-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="bg-primary rounded-full p-2 text-white mr-3">
                      <i className="fas fa-lightbulb"></i>
                    </div>
                    <div>
                      <h3 className="font-medium">AI Recommendation</h3>
                      <p className="text-sm text-gray-700 mt-1">
                        {currentPlan.aiFeedback}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
          
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Weekly Overview</TabsTrigger>
              <TabsTrigger value="equipment">Recommended Equipment</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <h2 className="text-xl font-semibold mb-4">Weekly Training Structure</h2>
              
              {currentPlan.planData?.workoutDays ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  {currentPlan.planData.workoutDays.map((day: any, index: number) => (
                    <WorkoutDayCard key={index} day={day} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No workout days specified in this plan.</p>
              )}
            </TabsContent>
            
            <TabsContent value="equipment">
              <h2 className="text-xl font-semibold mb-4">Recommended Equipment</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {equipmentItems.map((item, index) => (
                  <EquipmentCard key={index} equipment={item} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </section>
  );
}
