import {
  users, userProfiles, workoutPlans, exercises, loggedWorkouts,
  progressPhotos, progressMetrics,
  type User, type InsertUser, type UserProfile, type InsertUserProfile,
  type WorkoutPlan, type InsertWorkoutPlan, type Exercise, type InsertExercise,
  type LoggedWorkout, type InsertLoggedWorkout, type ProgressPhoto, type InsertProgressPhoto,
  type ProgressMetrics, type InsertProgressMetrics
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User | undefined>;
  
  // User Profile operations
  getUserProfile(userId: number): Promise<UserProfile | undefined>;
  createUserProfile(profile: InsertUserProfile): Promise<UserProfile>;
  updateUserProfile(userId: number, profileData: Partial<UserProfile>): Promise<UserProfile | undefined>;
  
  // Workout Plan operations
  getWorkoutPlan(id: number): Promise<WorkoutPlan | undefined>;
  getWorkoutPlansByUserId(userId: number): Promise<WorkoutPlan[]>;
  createWorkoutPlan(plan: InsertWorkoutPlan): Promise<WorkoutPlan>;
  updateWorkoutPlan(id: number, planData: Partial<WorkoutPlan>): Promise<WorkoutPlan | undefined>;
  deleteWorkoutPlan(id: number): Promise<boolean>;
  
  // Exercise operations
  getExercise(id: number): Promise<Exercise | undefined>;
  getAllExercises(): Promise<Exercise[]>;
  getExercisesByMuscleGroup(muscleGroup: string): Promise<Exercise[]>;
  createExercise(exercise: InsertExercise): Promise<Exercise>;
  
  // Logged Workout operations
  getLoggedWorkout(id: number): Promise<LoggedWorkout | undefined>;
  getLoggedWorkoutsByUserId(userId: number): Promise<LoggedWorkout[]>;
  createLoggedWorkout(workout: InsertLoggedWorkout): Promise<LoggedWorkout>;
  
  // Progress Photo operations
  getProgressPhoto(id: number): Promise<ProgressPhoto | undefined>;
  getProgressPhotosByUserId(userId: number): Promise<ProgressPhoto[]>;
  createProgressPhoto(photo: InsertProgressPhoto): Promise<ProgressPhoto>;
  deleteProgressPhoto(id: number): Promise<boolean>;
  
  // Progress Metrics operations
  getProgressMetrics(id: number): Promise<ProgressMetrics | undefined>;
  getProgressMetricsByUserId(userId: number): Promise<ProgressMetrics[]>;
  createProgressMetrics(metrics: InsertProgressMetrics): Promise<ProgressMetrics>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private userProfiles: Map<number, UserProfile>;
  private workoutPlans: Map<number, WorkoutPlan>;
  private exercises: Map<number, Exercise>;
  private loggedWorkouts: Map<number, LoggedWorkout>;
  private progressPhotos: Map<number, ProgressPhoto>;
  private progressMetrics: Map<number, ProgressMetrics>;
  
  private userId: number;
  private userProfileId: number;
  private workoutPlanId: number;
  private exerciseId: number;
  private loggedWorkoutId: number;
  private progressPhotoId: number;
  private progressMetricsId: number;

  constructor() {
    this.users = new Map();
    this.userProfiles = new Map();
    this.workoutPlans = new Map();
    this.exercises = new Map();
    this.loggedWorkouts = new Map();
    this.progressPhotos = new Map();
    this.progressMetrics = new Map();
    
    this.userId = 1;
    this.userProfileId = 1;
    this.workoutPlanId = 1;
    this.exerciseId = 1;
    this.loggedWorkoutId = 1;
    this.progressPhotoId = 1;
    this.progressMetricsId = 1;
    
    // Add some default exercises
    this.addDefaultExercises();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.userId++;
    const createdAt = new Date();
    const newUser: User = { 
      id, 
      username: user.username,
      password: user.password,
      firstName: user.firstName ?? null,
      lastName: user.lastName ?? null,
      email: user.email ?? null,
      isOnboarded: false,
      createdAt
    };
    this.users.set(id, newUser);
    return newUser;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // User Profile operations
  async getUserProfile(userId: number): Promise<UserProfile | undefined> {
    return Array.from(this.userProfiles.values()).find(
      (profile) => profile.userId === userId
    );
  }

  async createUserProfile(profile: InsertUserProfile): Promise<UserProfile> {
    const id = this.userProfileId++;
    const updatedAt = new Date();
    const newProfile: UserProfile = { ...profile, id, updatedAt };
    this.userProfiles.set(id, newProfile);
    return newProfile;
  }

  async updateUserProfile(userId: number, profileData: Partial<UserProfile>): Promise<UserProfile | undefined> {
    const profile = await this.getUserProfile(userId);
    if (!profile) return undefined;
    
    const updatedProfile = { ...profile, ...profileData, updatedAt: new Date() };
    this.userProfiles.set(profile.id, updatedProfile);
    return updatedProfile;
  }

  // Workout Plan operations
  async getWorkoutPlan(id: number): Promise<WorkoutPlan | undefined> {
    return this.workoutPlans.get(id);
  }

  async getWorkoutPlansByUserId(userId: number): Promise<WorkoutPlan[]> {
    return Array.from(this.workoutPlans.values()).filter(
      (plan) => plan.userId === userId
    );
  }

  async createWorkoutPlan(plan: InsertWorkoutPlan): Promise<WorkoutPlan> {
    const id = this.workoutPlanId++;
    const createdAt = new Date();
    const updatedAt = new Date();
    const newPlan: WorkoutPlan = { ...plan, id, createdAt, updatedAt };
    this.workoutPlans.set(id, newPlan);
    return newPlan;
  }

  async updateWorkoutPlan(id: number, planData: Partial<WorkoutPlan>): Promise<WorkoutPlan | undefined> {
    const plan = await this.getWorkoutPlan(id);
    if (!plan) return undefined;
    
    const updatedPlan = { ...plan, ...planData, updatedAt: new Date() };
    this.workoutPlans.set(id, updatedPlan);
    return updatedPlan;
  }

  async deleteWorkoutPlan(id: number): Promise<boolean> {
    return this.workoutPlans.delete(id);
  }

  // Exercise operations
  async getExercise(id: number): Promise<Exercise | undefined> {
    return this.exercises.get(id);
  }

  async getAllExercises(): Promise<Exercise[]> {
    return Array.from(this.exercises.values());
  }

  async getExercisesByMuscleGroup(muscleGroup: string): Promise<Exercise[]> {
    return Array.from(this.exercises.values()).filter(
      (exercise) => exercise.muscleGroup === muscleGroup
    );
  }

  async createExercise(exercise: InsertExercise): Promise<Exercise> {
    const id = this.exerciseId++;
    const newExercise: Exercise = { ...exercise, id };
    this.exercises.set(id, newExercise);
    return newExercise;
  }

  // Logged Workout operations
  async getLoggedWorkout(id: number): Promise<LoggedWorkout | undefined> {
    return this.loggedWorkouts.get(id);
  }

  async getLoggedWorkoutsByUserId(userId: number): Promise<LoggedWorkout[]> {
    return Array.from(this.loggedWorkouts.values())
      .filter((workout) => workout.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async createLoggedWorkout(workout: InsertLoggedWorkout): Promise<LoggedWorkout> {
    const id = this.loggedWorkoutId++;
    const newWorkout: LoggedWorkout = { ...workout, id };
    this.loggedWorkouts.set(id, newWorkout);
    return newWorkout;
  }

  // Progress Photo operations
  async getProgressPhoto(id: number): Promise<ProgressPhoto | undefined> {
    return this.progressPhotos.get(id);
  }

  async getProgressPhotosByUserId(userId: number): Promise<ProgressPhoto[]> {
    return Array.from(this.progressPhotos.values())
      .filter((photo) => photo.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async createProgressPhoto(photo: InsertProgressPhoto): Promise<ProgressPhoto> {
    const id = this.progressPhotoId++;
    const date = new Date();
    const newPhoto: ProgressPhoto = { ...photo, id, date };
    this.progressPhotos.set(id, newPhoto);
    return newPhoto;
  }

  async deleteProgressPhoto(id: number): Promise<boolean> {
    return this.progressPhotos.delete(id);
  }

  // Progress Metrics operations
  async getProgressMetrics(id: number): Promise<ProgressMetrics | undefined> {
    return this.progressMetrics.get(id);
  }

  async getProgressMetricsByUserId(userId: number): Promise<ProgressMetrics[]> {
    return Array.from(this.progressMetrics.values())
      .filter((metrics) => metrics.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async createProgressMetrics(metrics: InsertProgressMetrics): Promise<ProgressMetrics> {
    const id = this.progressMetricsId++;
    const date = new Date();
    const newMetrics: ProgressMetrics = { ...metrics, id, date };
    this.progressMetrics.set(id, newMetrics);
    return newMetrics;
  }

  // Helper methods
  private addDefaultExercises() {
    const defaultExercises: InsertExercise[] = [
      {
        name: "Bench Press",
        description: "A compound exercise that targets the chest, shoulders, and triceps",
        muscleGroup: "Chest",
        equipment: "Barbell, Bench",
        difficulty: "Intermediate",
        instructions: "Lie on a bench, lower the bar to your chest, and push it back up",
        videoUrl: "https://example.com/bench-press",
        imageUrl: "https://example.com/bench-press.jpg"
      },
      {
        name: "Squats",
        description: "A compound exercise that targets the quadriceps, hamstrings, and glutes",
        muscleGroup: "Legs",
        equipment: "Barbell",
        difficulty: "Intermediate",
        instructions: "Stand with feet shoulder-width apart, bend your knees, and lower your body as if sitting in a chair",
        videoUrl: "https://example.com/squats",
        imageUrl: "https://example.com/squats.jpg"
      },
      {
        name: "Deadlift",
        description: "A compound exercise that targets the back, hamstrings, and glutes",
        muscleGroup: "Back",
        equipment: "Barbell",
        difficulty: "Advanced",
        instructions: "Stand with feet hip-width apart, bend at the hips and knees to grip the bar, and lift by extending your hips and knees",
        videoUrl: "https://example.com/deadlift",
        imageUrl: "https://example.com/deadlift.jpg"
      },
      {
        name: "Pull-ups",
        description: "A compound exercise that targets the back and biceps",
        muscleGroup: "Back",
        equipment: "Pull-up bar",
        difficulty: "Intermediate",
        instructions: "Hang from a bar with palms facing away from you, pull your body up until your chin is over the bar",
        videoUrl: "https://example.com/pull-ups",
        imageUrl: "https://example.com/pull-ups.jpg"
      },
      {
        name: "Push-ups",
        description: "A bodyweight exercise that targets the chest, shoulders, and triceps",
        muscleGroup: "Chest",
        equipment: "None",
        difficulty: "Beginner",
        instructions: "Start in a plank position, lower your body until your chest nearly touches the floor, then push back up",
        videoUrl: "https://example.com/push-ups",
        imageUrl: "https://example.com/push-ups.jpg"
      }
    ];

    defaultExercises.forEach(exercise => {
      this.createExercise(exercise);
    });
  }
}

import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    const PostgresSessionStore = connectPg(session);
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true,
      tableName: 'sessions'
    });
    
    // Initialize default exercises if table is empty
    this.initializeDefaultExercises();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const result = await db.update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return result[0];
  }

  // User Profile operations
  async getUserProfile(userId: number): Promise<UserProfile | undefined> {
    const result = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId));
    return result[0];
  }

  async createUserProfile(profile: InsertUserProfile): Promise<UserProfile> {
    const result = await db.insert(userProfiles).values(profile).returning();
    return result[0];
  }

  async updateUserProfile(userId: number, profileData: Partial<UserProfile>): Promise<UserProfile | undefined> {
    const result = await db.update(userProfiles)
      .set({...profileData, updatedAt: new Date()})
      .where(eq(userProfiles.userId, userId))
      .returning();
    return result[0];
  }

  // Workout Plan operations
  async getWorkoutPlan(id: number): Promise<WorkoutPlan | undefined> {
    const result = await db.select().from(workoutPlans).where(eq(workoutPlans.id, id));
    return result[0];
  }

  async getWorkoutPlansByUserId(userId: number): Promise<WorkoutPlan[]> {
    return db.select().from(workoutPlans)
      .where(eq(workoutPlans.userId, userId))
      .orderBy(desc(workoutPlans.createdAt));
  }

  async createWorkoutPlan(plan: InsertWorkoutPlan): Promise<WorkoutPlan> {
    const result = await db.insert(workoutPlans).values(plan).returning();
    return result[0];
  }

  async updateWorkoutPlan(id: number, planData: Partial<WorkoutPlan>): Promise<WorkoutPlan | undefined> {
    const result = await db.update(workoutPlans)
      .set({...planData, updatedAt: new Date()})
      .where(eq(workoutPlans.id, id))
      .returning();
    return result[0];
  }

  async deleteWorkoutPlan(id: number): Promise<boolean> {
    const result = await db.delete(workoutPlans).where(eq(workoutPlans.id, id)).returning();
    return result.length > 0;
  }

  // Exercise operations
  async getExercise(id: number): Promise<Exercise | undefined> {
    const result = await db.select().from(exercises).where(eq(exercises.id, id));
    return result[0];
  }

  async getAllExercises(): Promise<Exercise[]> {
    return db.select().from(exercises);
  }

  async getExercisesByMuscleGroup(muscleGroup: string): Promise<Exercise[]> {
    return db.select().from(exercises).where(eq(exercises.muscleGroup, muscleGroup));
  }

  async createExercise(exercise: InsertExercise): Promise<Exercise> {
    const result = await db.insert(exercises).values(exercise).returning();
    return result[0];
  }

  // Logged Workout operations
  async getLoggedWorkout(id: number): Promise<LoggedWorkout | undefined> {
    const result = await db.select().from(loggedWorkouts).where(eq(loggedWorkouts.id, id));
    return result[0];
  }

  async getLoggedWorkoutsByUserId(userId: number): Promise<LoggedWorkout[]> {
    return db.select().from(loggedWorkouts)
      .where(eq(loggedWorkouts.userId, userId))
      .orderBy(desc(loggedWorkouts.date));
  }

  async createLoggedWorkout(workout: InsertLoggedWorkout): Promise<LoggedWorkout> {
    const result = await db.insert(loggedWorkouts).values(workout).returning();
    return result[0];
  }

  // Progress Photo operations
  async getProgressPhoto(id: number): Promise<ProgressPhoto | undefined> {
    const result = await db.select().from(progressPhotos).where(eq(progressPhotos.id, id));
    return result[0];
  }

  async getProgressPhotosByUserId(userId: number): Promise<ProgressPhoto[]> {
    return db.select().from(progressPhotos)
      .where(eq(progressPhotos.userId, userId))
      .orderBy(desc(progressPhotos.date));
  }

  async createProgressPhoto(photo: InsertProgressPhoto): Promise<ProgressPhoto> {
    const result = await db.insert(progressPhotos).values(photo).returning();
    return result[0];
  }

  async deleteProgressPhoto(id: number): Promise<boolean> {
    const result = await db.delete(progressPhotos).where(eq(progressPhotos.id, id)).returning();
    return result.length > 0;
  }

  // Progress Metrics operations
  async getProgressMetrics(id: number): Promise<ProgressMetrics | undefined> {
    const result = await db.select().from(progressMetrics).where(eq(progressMetrics.id, id));
    return result[0];
  }

  async getProgressMetricsByUserId(userId: number): Promise<ProgressMetrics[]> {
    return db.select().from(progressMetrics)
      .where(eq(progressMetrics.userId, userId))
      .orderBy(desc(progressMetrics.date));
  }

  async createProgressMetrics(metrics: InsertProgressMetrics): Promise<ProgressMetrics> {
    const result = await db.insert(progressMetrics).values(metrics).returning();
    return result[0];
  }

  // Helper methods
  private async initializeDefaultExercises() {
    try {
      // Check if exercises table exists first
      const tableExists = await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'exercises'
        )
      `);
      
      if (!tableExists.rows[0].exists) {
        console.log("Exercises table doesn't exist yet. Skipping default exercise initialization.");
        return;
      }
      
      // Check if exercises table is empty
      const exercisesCount = await pool.query('SELECT COUNT(*) FROM exercises');
      
      if (parseInt(exercisesCount.rows[0].count) === 0) {
        console.log("Initializing default exercises...");
        
        const defaultExercises = [
          {
            name: "Bench Press",
            description: "A compound exercise that targets the chest, shoulders, and triceps",
            muscleGroup: "Chest",
            equipment: "Barbell, Bench",
            difficulty: "Intermediate",
            instructions: "Lie on a bench, lower the bar to your chest, and push it back up"
          },
          {
            name: "Squats",
            description: "A compound exercise that targets the quadriceps, hamstrings, and glutes",
            muscleGroup: "Legs",
            equipment: "Barbell",
            difficulty: "Intermediate",
            instructions: "Stand with feet shoulder-width apart, bend your knees, and lower your body as if sitting in a chair"
          },
          {
            name: "Deadlift",
            description: "A compound exercise that targets the back, hamstrings, and glutes",
            muscleGroup: "Back",
            equipment: "Barbell",
            difficulty: "Advanced",
            instructions: "Stand with feet hip-width apart, bend at the hips and knees to grip the bar, and lift by extending your hips and knees"
          },
          {
            name: "Pull-ups",
            description: "A compound exercise that targets the back and biceps",
            muscleGroup: "Back",
            equipment: "Pull-up bar",
            difficulty: "Intermediate",
            instructions: "Hang from a bar with palms facing away from you, pull your body up until your chin is over the bar"
          },
          {
            name: "Push-ups",
            description: "A bodyweight exercise that targets the chest, shoulders, and triceps",
            muscleGroup: "Chest",
            equipment: "None",
            difficulty: "Beginner",
            instructions: "Start in a plank position, lower your body until your chest nearly touches the floor, then push back up"
          }
        ];
        
        for (const exercise of defaultExercises) {
          await pool.query(`
            INSERT INTO exercises (name, description, muscle_group, equipment, difficulty, instructions)
            VALUES ($1, $2, $3, $4, $5, $6)
          `, [
            exercise.name,
            exercise.description,
            exercise.muscleGroup,
            exercise.equipment,
            exercise.difficulty,
            exercise.instructions
          ]);
        }
        
        console.log("Default exercises added successfully!");
      }
    } catch (error) {
      console.error("Error initializing default exercises:", error);
    }
  }
}

// Use database storage instead of memory storage
export const storage = new DatabaseStorage();
