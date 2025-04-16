import { useCurrentUser } from "@/hooks/use-user";
import { useUserProfile } from "@/hooks/use-user";
import { useLoggedWorkouts } from "@/hooks/use-workout";
import { useProgressPhotos } from "@/hooks/use-progress";
import { getDummyUserStats, getWeekSchedule, getImagePlaceholder } from "@/lib/utils";
import { StatsOverview } from "@/components/workout/stats-overview";
import { WeeklySchedule } from "@/components/workout/weekly-schedule";
import { ProgressPhotoGallery } from "@/components/workout/progress-photo-gallery";
import { WorkoutCard } from "@/components/workout/workout-card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useLocation } from "wouter";
import { AddPhotoForm } from "@/components/progress/add-photo-form";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function Dashboard() {
  const { data: user } = useCurrentUser();
  const { data: profile } = useUserProfile(user?.id);
  const { data: workouts = [] } = useLoggedWorkouts(user?.id);
  const { data: photos = [] } = useProgressPhotos(user?.id);
  const [_, setLocation] = useLocation();
  const [showAddPhotoDialog, setShowAddPhotoDialog] = useState(false);
  
  // Get the most recent workout
  const latestWorkout = workouts[0];
  
  // Weekly schedule data
  const weekSchedule = getWeekSchedule();
  
  // Stats data
  const stats = getDummyUserStats();
  
  return (
    <section className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Fitness Dashboard</h1>
          <p className="text-sm text-gray-600">
            Welcome back {profile?.firstName || user?.firstName || user?.username}! Looking strong today.
          </p>
        </div>
        <div className="hidden sm:block">
          <Button 
            onClick={() => setLocation("/workout-log")}
            className="inline-flex items-center"
          >
            <i className="fas fa-plus mr-2"></i> Log Workout
          </Button>
        </div>
      </div>

      {/* Motivation Banner */}
      <div className="relative overflow-hidden rounded-xl mb-8 bg-gradient-to-r from-blue-600 to-primary">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url('${getImagePlaceholder('motivation')}')`,
          backgroundSize: 'cover'
        }}></div>
        <div className="relative px-6 py-8 md:flex md:items-center">
          <div className="text-white mr-4 mb-4 md:mb-0">
            <h2 className="text-xl font-bold">
              Today's Focus: {weekSchedule.find(day => day.isToday)?.workout || 'Rest Day'}
            </h2>
            <p className="mt-1 text-white text-opacity-90">
              Your personalized plan is ready. Let's crush those goals!
            </p>
            <div className="mt-4">
              <Button 
                variant="secondary" 
                className="bg-white text-primary font-medium hover:bg-blue-50"
                onClick={() => setLocation("/workout-plan")}
              >
                Start Workout
              </Button>
            </div>
          </div>
          <div className="hidden md:block ml-auto">
            <img 
              src={getImagePlaceholder('workout')} 
              alt="Workout motivation" 
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <h2 className="text-xl font-semibold mb-4">Your Progress Overview</h2>
      <StatsOverview stats={stats} />

      {/* Weekly Schedule */}
      <WeeklySchedule schedule={weekSchedule} />

      {/* Progress Photos Section */}
      <ProgressPhotoGallery 
        photos={photos} 
        onAddPhoto={() => setShowAddPhotoDialog(true)} 
      />

      {/* Latest Workout Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Latest Workout</h2>
        
        {latestWorkout ? (
          <WorkoutCard workout={latestWorkout} />
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 mb-4">You haven't logged any workouts yet.</p>
            <Button 
              onClick={() => setLocation("/workout-log")}
              className="inline-flex items-center"
            >
              <i className="fas fa-plus mr-2"></i> Log Your First Workout
            </Button>
          </div>
        )}
      </div>

      {/* Add Photo Dialog */}
      <Dialog open={showAddPhotoDialog} onOpenChange={setShowAddPhotoDialog}>
        <DialogContent className="sm:max-w-md">
          <AddPhotoForm 
            userId={user?.id} 
            onSuccess={() => setShowAddPhotoDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </section>
  );
}
