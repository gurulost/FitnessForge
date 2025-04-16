import { pgTable, text, serial, integer, boolean, date, timestamp, json, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  email: text("email"),
  isOnboarded: boolean("is_onboarded").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// User profile information
export const userProfiles = pgTable("user_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  age: integer("age"),
  sex: text("sex"),
  heightFeet: integer("height_feet"),
  heightInches: integer("height_inches"),
  weight: integer("weight"),
  fitnessLevel: text("fitness_level"),
  primaryGoal: text("primary_goal"),
  workoutFrequency: integer("workout_frequency"),
  preferredWorkoutType: text("preferred_workout_type"),
  equipmentAccess: text("equipment_access"),
  medicalConditions: text("medical_conditions"),
  bodyFat: integer("body_fat"),
  bmi: integer("bmi"),
  restingHeartRate: integer("resting_heart_rate"),
  maxBenchPress: integer("max_bench_press"),
  maxSquat: integer("max_squat"),
  mileTime: integer("mile_time"),
  dailyCalories: integer("daily_calories"),
  proteinGoal: integer("protein_goal"),
  waterIntake: integer("water_intake"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Workouts assigned to users
export const workoutPlans = pgTable("workout_plans", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  focus: text("focus"),
  duration: integer("duration").notNull(),
  workoutType: text("workout_type"),
  difficulty: text("difficulty"),
  planData: json("plan_data"),
  aiFeedback: text("ai_feedback"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Exercise library
export const exercises = pgTable("exercises", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  muscleGroup: text("muscle_group"),
  equipment: text("equipment"),
  difficulty: text("difficulty"),
  instructions: text("instructions"),
  videoUrl: text("video_url"),
  imageUrl: text("image_url"),
});

// Logged workouts completed by users
export const loggedWorkouts = pgTable("logged_workouts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  workoutPlanId: integer("workout_plan_id").references(() => workoutPlans.id),
  name: text("name").notNull(),
  date: timestamp("date").notNull(),
  duration: integer("duration"),
  notes: text("notes"),
  rating: integer("rating"),
  exerciseData: json("exercise_data"),
  aiFeedback: text("ai_feedback"),
});

// Progress photos
export const progressPhotos = pgTable("progress_photos", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  photoUrl: text("photo_url").notNull(),
  caption: text("caption"),
  date: timestamp("date").defaultNow(),
});

// Progress metrics
export const progressMetrics = pgTable("progress_metrics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  date: timestamp("date").defaultNow(),
  weight: integer("weight"),
  bodyFat: integer("body_fat"),
  chestMeasurement: integer("chest_measurement"),
  waistMeasurement: integer("waist_measurement"),
  hipsMeasurement: integer("hips_measurement"),
  armsMeasurement: integer("arms_measurement"),
  thighsMeasurement: integer("thighs_measurement"),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertUserProfileSchema = createInsertSchema(userProfiles).omit({
  id: true,
  updatedAt: true,
});

export const insertWorkoutPlanSchema = createInsertSchema(workoutPlans).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertExerciseSchema = createInsertSchema(exercises).omit({
  id: true,
});

export const insertLoggedWorkoutSchema = createInsertSchema(loggedWorkouts).omit({
  id: true,
});

export const insertProgressPhotoSchema = createInsertSchema(progressPhotos).omit({
  id: true,
  date: true,
});

export const insertProgressMetricsSchema = createInsertSchema(progressMetrics).omit({
  id: true,
  date: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;

export type WorkoutPlan = typeof workoutPlans.$inferSelect;
export type InsertWorkoutPlan = z.infer<typeof insertWorkoutPlanSchema>;

export type Exercise = typeof exercises.$inferSelect;
export type InsertExercise = z.infer<typeof insertExerciseSchema>;

export type LoggedWorkout = typeof loggedWorkouts.$inferSelect;
export type InsertLoggedWorkout = z.infer<typeof insertLoggedWorkoutSchema>;

export type ProgressPhoto = typeof progressPhotos.$inferSelect;
export type InsertProgressPhoto = z.infer<typeof insertProgressPhotoSchema>;

export type ProgressMetrics = typeof progressMetrics.$inferSelect;
export type InsertProgressMetrics = z.infer<typeof insertProgressMetricsSchema>;

// Zod schemas for validation
export const userLoginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const userRegistrationSchema = insertUserSchema.extend({
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});
