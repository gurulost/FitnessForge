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
    const newUser: User = { ...user, id, createdAt, isOnboarded: false };
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

export const storage = new MemStorage();
