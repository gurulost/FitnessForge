import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { UserStats, WeekSchedule, ProgressMetrics } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function formatTime(date: Date | string): string {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  });
}

export function formatDateTime(date: Date | string): string {
  if (!date) return '';
  const d = new Date(date);
  return `${formatDate(d)}, ${formatTime(d)}`;
}

export function getWeekSchedule(): WeekSchedule[] {
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  const currentDay = today.getDay();
  
  return Array.from({ length: 7 }).map((_, index) => {
    const dayDate = new Date();
    dayDate.setDate(today.getDate() - currentDay + index);
    
    return {
      day: weekdays[index],
      date: dayDate.getDate(),
      isRest: [0, 3, 6].includes(index), // Example rest days (Sun, Wed, Sat)
      isToday: index === currentDay,
      workout: !([0, 3, 6].includes(index)) ? 
        ['Upper', 'Lower', 'Cardio', 'Full'][index % 4] : undefined
    };
  });
}

export function getDummyUserStats(): UserStats {
  return {
    workoutsThisWeek: 4,
    workoutChange: 2,
    streak: 7,
    caloriesBurned: 3240,
    goalProgress: 65
  };
}

export function getProgressChartData(metrics: ProgressMetrics[]): any[] {
  if (!metrics || metrics.length === 0) {
    return [];
  }
  
  // Sort metrics by date
  const sortedMetrics = [...metrics].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  return sortedMetrics.map(metric => {
    return {
      date: formatDate(metric.date),
      weight: metric.weight,
      bodyFat: metric.bodyFat,
      chest: metric.chestMeasurement,
      waist: metric.waistMeasurement,
      hips: metric.hipsMeasurement,
      arms: metric.armsMeasurement,
      thighs: metric.thighsMeasurement
    };
  });
}

export function calculateBMI(weight: number, feet: number, inches: number): number {
  if (!weight || !feet) return 0;
  
  // Convert height to meters
  const totalInches = (feet * 12) + (inches || 0);
  const heightMeters = totalInches * 0.0254;
  
  // Convert weight to kg
  const weightKg = weight * 0.453592;
  
  // Calculate BMI
  const bmi = weightKg / (heightMeters * heightMeters);
  
  return parseFloat(bmi.toFixed(1));
}

export function getImagePlaceholder(type: string): string {
  // For a real app we'd use actual images, but this provides fallbacks
  const placeholders = {
    profile: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
    motivation: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    workout: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=200&q=80",
    progress1: "https://images.unsplash.com/photo-1571731956672-f2b94d7dd0cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=300&q=80",
    progress2: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=300&q=80",
    progress3: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=300&q=80",
    equipment1: "https://images.unsplash.com/photo-1517344884709-240a78058e5b?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=200&q=80",
    equipment2: "https://images.unsplash.com/photo-1507398941214-572c25f4b1dc?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=200&q=80",
    equipment3: "https://images.unsplash.com/photo-1591291621086-ffc211974a6b?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=200&q=80",
    equipment4: "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=200&q=80",
  };
  
  return placeholders[type] || "https://via.placeholder.com/300";
}

export function getEquipmentList() {
  return [
    {
      name: "Dumbbells",
      description: "Adjustable set recommended",
      imageUrl: "https://images.unsplash.com/photo-1517344884709-240a78058e5b?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=200&q=80"
    },
    {
      name: "Resistance Bands",
      description: "Multiple resistance levels",
      imageUrl: "https://images.unsplash.com/photo-1507398941214-572c25f4b1dc?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=200&q=80"
    },
    {
      name: "Yoga Mat",
      description: "For floor exercises",
      imageUrl: "https://images.unsplash.com/photo-1591291621086-ffc211974a6b?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=200&q=80"
    },
    {
      name: "Kettlebell",
      description: "For dynamic exercises",
      imageUrl: "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=200&q=80"
    }
  ];
}

export function getGoalOptions() {
  return [
    { value: "weight_loss", label: "Weight Loss" },
    { value: "muscle_gain", label: "Muscle Gain" },
    { value: "strength", label: "Strength" },
    { value: "endurance", label: "Endurance" },
    { value: "flexibility", label: "Flexibility" },
    { value: "general_fitness", label: "General Fitness" },
    { value: "sport_specific", label: "Sport-Specific Training" },
    { value: "health", label: "Health Improvement" }
  ];
}

export function getFitnessLevelOptions() {
  return [
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
    { value: "athletic", label: "Athletic" }
  ];
}

export function getWorkoutTypeOptions() {
  return [
    { value: "strength_training", label: "Strength Training" },
    { value: "cardio", label: "Cardio" },
    { value: "hiit", label: "HIIT" },
    { value: "crossfit", label: "CrossFit" },
    { value: "bodyweight", label: "Bodyweight" },
    { value: "yoga", label: "Yoga" },
    { value: "pilates", label: "Pilates" },
    { value: "mixed", label: "Mixed" }
  ];
}

export function getEquipmentAccessOptions() {
  return [
    { value: "none", label: "No Equipment" },
    { value: "minimal", label: "Minimal (Resistance bands, few dumbbells)" },
    { value: "home_gym", label: "Home Gym" },
    { value: "full_gym", label: "Full Gym Access" }
  ];
}

export function getMuscleGroups() {
  return [
    "Chest", "Back", "Shoulders", "Biceps", "Triceps", 
    "Legs", "Glutes", "Core", "Full Body", "Cardio"
  ];
}
