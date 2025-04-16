import { useState } from "react";
import { useCurrentUser, useUpdateUserProfile } from "@/hooks/use-user";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BasicInfoForm, BasicInfoValues } from "@/components/onboarding/basic-info-form";
import { FitnessGoalsForm, FitnessGoalsValues } from "@/components/onboarding/fitness-goals-form";
import { FitnessLevelForm, FitnessLevelValues } from "@/components/onboarding/fitness-level-form";
import { PreferencesForm, PreferencesValues } from "@/components/onboarding/preferences-form";
import { useToast } from "@/hooks/use-toast";

export default function Onboarding() {
  const { data: user } = useCurrentUser();
  const updateProfile = useUpdateUserProfile();
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    basicInfo: {} as BasicInfoValues,
    fitnessGoals: {} as FitnessGoalsValues,
    fitnessLevel: {} as FitnessLevelValues,
    preferences: {} as PreferencesValues
  });
  
  const handleBasicInfoSubmit = (data: BasicInfoValues) => {
    setFormData(prev => ({ ...prev, basicInfo: data }));
    setStep(2);
  };
  
  const handleFitnessGoalsSubmit = (data: FitnessGoalsValues) => {
    setFormData(prev => ({ ...prev, fitnessGoals: data }));
    setStep(3);
  };
  
  const handleFitnessLevelSubmit = (data: FitnessLevelValues) => {
    setFormData(prev => ({ ...prev, fitnessLevel: data }));
    setStep(4);
  };
  
  const handlePreferencesSubmit = async (data: PreferencesValues) => {
    setFormData(prev => ({ ...prev, preferences: data }));
    
    if (!user?.id) {
      toast({
        title: "Error",
        description: "User information not found. Please try again.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Combine all form data
      const profileData = {
        userId: user.id,
        age: formData.basicInfo.age,
        sex: formData.basicInfo.sex,
        heightFeet: formData.basicInfo.heightFeet,
        heightInches: formData.basicInfo.heightInches,
        weight: formData.basicInfo.weight,
        primaryGoal: formData.fitnessGoals.primaryGoal,
        fitnessLevel: formData.fitnessLevel.fitnessLevel,
        workoutFrequency: formData.fitnessLevel.workoutFrequency,
        preferredWorkoutType: formData.fitnessLevel.preferredWorkoutType,
        equipmentAccess: data.equipmentAccess,
        medicalConditions: data.medicalConditions,
      };
      
      await updateProfile.mutateAsync(profileData);
      
      toast({
        title: "Profile created!",
        description: "Your personalized workout journey begins now.",
      });
      
      setLocation("/");
    } catch (error) {
      toast({
        title: "Error creating profile",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const progressPercentage = (step / 4) * 100;
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-lg shadow-xl">
        <div className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Welcome to FitEvolved</h2>
            <p className="text-gray-600 mt-1">Let's set up your profile to create your personalized workout plan</p>
          </div>
          
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Step {step} of 4</span>
              <div className="w-32 bg-gray-200 rounded-full h-1.5">
                <Progress value={progressPercentage} className="h-1.5" />
              </div>
            </div>
            
            {step === 1 && (
              <BasicInfoForm onNext={handleBasicInfoSubmit} defaultValues={formData.basicInfo} />
            )}
            
            {step === 2 && (
              <FitnessGoalsForm 
                onNext={handleFitnessGoalsSubmit} 
                onBack={() => setStep(1)} 
                defaultValues={formData.fitnessGoals} 
              />
            )}
            
            {step === 3 && (
              <FitnessLevelForm 
                onNext={handleFitnessLevelSubmit} 
                onBack={() => setStep(2)} 
                defaultValues={formData.fitnessLevel} 
              />
            )}
            
            {step === 4 && (
              <PreferencesForm 
                onNext={handlePreferencesSubmit} 
                onBack={() => setStep(3)} 
                defaultValues={formData.preferences} 
                isSubmitting={updateProfile.isPending}
              />
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
