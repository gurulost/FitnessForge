// User related types
export interface User {
  id: number;
  username: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  isOnboarded: boolean;
  createdAt: Date;
}

export interface UserProfile {
  id: number;
  userId: number;
  age?: number;
  sex?: string;
  heightFeet?: number;
  heightInches?: number;
  weight?: number;
  fitnessLevel?: string;
  primaryGoal?: string;
  workoutFrequency?: number;
  preferredWorkoutType?: string;
  equipmentAccess?: string;
  medicalConditions?: string;
  bodyFat?: number;
  bmi?: number;
  restingHeartRate?: number;
  maxBenchPress?: number;
  maxSquat?: number;
  mileTime?: number;
  dailyCalories?: number;
  proteinGoal?: number;
  waterIntake?: number;
  updatedAt: Date;
}

export interface CreateUserRequest {
  username: string;
  password: string;
  confirmPassword: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

// Workout related types
export interface WorkoutPlan {
  id: number;
  userId: number;
  name: string;
  description?: string;
  focus?: string;
  duration: number;
  workoutType?: string;
  difficulty?: string;
  planData?: any;
  aiFeedback?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Exercise {
  id: number;
  name: string;
  description?: string;
  muscleGroup?: string;
  equipment?: string;
  difficulty?: string;
  instructions?: string;
  videoUrl?: string;
  imageUrl?: string;
}

export interface LoggedWorkout {
  id: number;
  userId: number;
  workoutPlanId?: number;
  name: string;
  date: Date;
  duration?: number;
  notes?: string;
  rating?: number;
  exerciseData?: any;
  aiFeedback?: string;
}

// Progress related types
export interface ProgressPhoto {
  id: number;
  userId: number;
  photoUrl: string;
  caption?: string;
  date: Date;
}

export interface ProgressMetrics {
  id: number;
  userId: number;
  date: Date;
  weight?: number;
  bodyFat?: number;
  chestMeasurement?: number;
  waistMeasurement?: number;
  hipsMeasurement?: number;
  armsMeasurement?: number;
  thighsMeasurement?: number;
}

// Dashboard and stats types
export interface WeekSchedule {
  day: string;
  date: number;
  workout?: string;
  isRest: boolean;
  isToday: boolean;
}

export interface UserStats {
  workoutsThisWeek: number;
  workoutChange: number;
  streak: number;
  caloriesBurned: number;
  goalProgress: number;
}

// AI Response types
export interface WorkoutPlanResponse {
  planName: string;
  planDescription: string;
  duration: string;
  focus: string;
  workoutDays: WorkoutDay[];
  recommendations: {
    nutrition: string;
    recovery: string;
    progression: string;
  };
}

export interface WorkoutDay {
  day: string;
  focus: string;
  exercises: WorkoutExercise[];
}

export interface WorkoutExercise {
  name: string;
  sets: string;
  reps: string;
  notes?: string;
}

// Form related types
export interface OnboardingFormData {
  // Basic Info
  age: number;
  sex: string;
  heightFeet: number;
  heightInches: number;
  weight: number;
  
  // Fitness Goals
  primaryGoal: string;
  secondaryGoals: string[];
  targetWeight?: number;
  
  // Fitness Level
  fitnessLevel: string;
  workoutFrequency: number;
  workoutDuration: number;
  preferredWorkoutType: string;
  
  // Preferences
  equipmentAccess: string;
  timeAvailability: string;
  dietaryPreferences: string;
  medicalConditions: string;
}

// Equipment for workout recommendation
export interface EquipmentItem {
  name: string;
  description: string;
  imageUrl: string;
}

// FitnessQuestion type
export interface FitnessQuestion {
  question: string;
  answer: string;
}
