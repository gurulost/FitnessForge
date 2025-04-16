import { pgTable, text, serial, integer, boolean, date, timestamp, json, uuid, jsonb, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

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

export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(userProfiles, {
    fields: [users.id],
    references: [userProfiles.userId],
  }),
  workoutPlans: many(workoutPlans),
  loggedWorkouts: many(loggedWorkouts),
  progressPhotos: many(progressPhotos),
  progressMetrics: many(progressMetrics),
}));

// User profile information
export const userProfiles = pgTable("user_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }).unique(),
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

export const userProfilesRelations = relations(userProfiles, ({ one }) => ({
  user: one(users, {
    fields: [userProfiles.userId],
    references: [users.id],
  }),
}));

// Workouts assigned to users
export const workoutPlans = pgTable("workout_plans", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  focus: text("focus"),
  duration: integer("duration").notNull(),
  workoutType: text("workout_type"),
  difficulty: text("difficulty"),
  planData: jsonb("plan_data"),
  aiFeedback: text("ai_feedback"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const workoutPlansRelations = relations(workoutPlans, ({ one, many }) => ({
  user: one(users, {
    fields: [workoutPlans.userId],
    references: [users.id],
  }),
  loggedWorkouts: many(loggedWorkouts),
}));

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
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  workoutPlanId: integer("workout_plan_id").references(() => workoutPlans.id, { onDelete: "set null" }),
  name: text("name").notNull(),
  date: timestamp("date").notNull(),
  duration: integer("duration"),
  notes: text("notes"),
  rating: integer("rating"),
  exerciseData: jsonb("exercise_data"),
  aiFeedback: text("ai_feedback"),
});

export const loggedWorkoutsRelations = relations(loggedWorkouts, ({ one }) => ({
  user: one(users, {
    fields: [loggedWorkouts.userId],
    references: [users.id],
  }),
  workoutPlan: one(workoutPlans, {
    fields: [loggedWorkouts.workoutPlanId],
    references: [workoutPlans.id],
  }),
}));

// Progress photos
export const progressPhotos = pgTable("progress_photos", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  photoUrl: text("photo_url").notNull(),
  caption: text("caption"),
  date: timestamp("date").defaultNow(),
});

export const progressPhotosRelations = relations(progressPhotos, ({ one }) => ({
  user: one(users, {
    fields: [progressPhotos.userId],
    references: [users.id],
  }),
}));

// Progress metrics
export const progressMetrics = pgTable("progress_metrics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  date: timestamp("date").defaultNow(),
  weight: integer("weight"),
  bodyFat: real("body_fat"),
  chestMeasurement: real("chest_measurement"),
  waistMeasurement: real("waist_measurement"),
  hipsMeasurement: real("hips_measurement"),
  armsMeasurement: real("arms_measurement"),
  thighsMeasurement: real("thighs_measurement"),
});

export const progressMetricsRelations = relations(progressMetrics, ({ one }) => ({
  user: one(users, {
    fields: [progressMetrics.userId],
    references: [users.id],
  }),
}));

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
