import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateWorkoutPlan, generateWorkoutFeedback, generateHealthInsights, answerFitnessQuestion } from "./anthropic";
import { 
  userLoginSchema, 
  userRegistrationSchema, 
  insertUserProfileSchema, 
  insertWorkoutPlanSchema, 
  insertLoggedWorkoutSchema, 
  insertProgressPhotoSchema, 
  insertProgressMetricsSchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // ==================== AUTH ROUTES ====================
  // Auth routes are handled by setupAuth() in server/auth.ts
  
  // ==================== USER PROFILE ROUTES ====================
  
  // Get user profile
  app.get('/api/profile/:userId', async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId, 10);
      const profile = await storage.getUserProfile(userId);
      
      if (!profile) {
        return res.status(404).json({ message: 'Profile not found' });
      }
      
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get profile' });
    }
  });
  
  // Create or update user profile
  app.post('/api/profile', async (req: Request, res: Response) => {
    try {
      const data = insertUserProfileSchema.parse(req.body);
      
      // Check if profile already exists
      const existingProfile = await storage.getUserProfile(data.userId);
      
      let profile;
      if (existingProfile) {
        profile = await storage.updateUserProfile(data.userId, data);
      } else {
        profile = await storage.createUserProfile(data);
        // Update user's onboarded status
        await storage.updateUser(data.userId, { isOnboarded: true });
      }
      
      res.json(profile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid input', errors: error.format() });
      }
      res.status(500).json({ message: 'Failed to save profile' });
    }
  });
  
  // ==================== WORKOUT PLAN ROUTES ====================
  
  // Get workout plans for a user
  app.get('/api/workout-plans/:userId', async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId, 10);
      const plans = await storage.getWorkoutPlansByUserId(userId);
      res.json(plans);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get workout plans' });
    }
  });
  
  // Get a specific workout plan
  app.get('/api/workout-plan/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      const plan = await storage.getWorkoutPlan(id);
      
      if (!plan) {
        return res.status(404).json({ message: 'Workout plan not found' });
      }
      
      res.json(plan);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get workout plan' });
    }
  });
  
  // Create a workout plan
  app.post('/api/workout-plan', async (req: Request, res: Response) => {
    try {
      const data = insertWorkoutPlanSchema.parse(req.body);
      const plan = await storage.createWorkoutPlan(data);
      res.status(201).json(plan);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid input', errors: error.format() });
      }
      res.status(500).json({ message: 'Failed to create workout plan' });
    }
  });
  
  // Update a workout plan
  app.put('/api/workout-plan/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      const data = insertWorkoutPlanSchema.partial().parse(req.body);
      
      const plan = await storage.updateWorkoutPlan(id, data);
      
      if (!plan) {
        return res.status(404).json({ message: 'Workout plan not found' });
      }
      
      res.json(plan);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid input', errors: error.format() });
      }
      res.status(500).json({ message: 'Failed to update workout plan' });
    }
  });
  
  // Delete a workout plan
  app.delete('/api/workout-plan/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      const success = await storage.deleteWorkoutPlan(id);
      
      if (!success) {
        return res.status(404).json({ message: 'Workout plan not found' });
      }
      
      res.json({ message: 'Workout plan deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete workout plan' });
    }
  });
  
  // ==================== LOGGED WORKOUT ROUTES ====================
  
  // Get logged workouts for a user
  app.get('/api/logged-workouts/:userId', async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId, 10);
      const workouts = await storage.getLoggedWorkoutsByUserId(userId);
      res.json(workouts);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get logged workouts' });
    }
  });
  
  // Get a specific logged workout
  app.get('/api/logged-workout/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      const workout = await storage.getLoggedWorkout(id);
      
      if (!workout) {
        return res.status(404).json({ message: 'Logged workout not found' });
      }
      
      res.json(workout);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get logged workout' });
    }
  });
  
  // Log a workout
  app.post('/api/logged-workout', async (req: Request, res: Response) => {
    try {
      const data = insertLoggedWorkoutSchema.parse(req.body);
      
      // For AI feedback, get user profile
      const userProfile = await storage.getUserProfile(data.userId);
      
      if (userProfile) {
        // Generate AI feedback
        const feedback = await generateWorkoutFeedback(data, userProfile);
        data.aiFeedback = feedback;
      }
      
      const workout = await storage.createLoggedWorkout(data);
      res.status(201).json(workout);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid input', errors: error.format() });
      }
      res.status(500).json({ message: 'Failed to log workout' });
    }
  });
  
  // ==================== EXERCISE ROUTES ====================
  
  // Get all exercises
  app.get('/api/exercises', async (_req: Request, res: Response) => {
    try {
      const exercises = await storage.getAllExercises();
      res.json(exercises);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get exercises' });
    }
  });
  
  // Get exercises by muscle group
  app.get('/api/exercises/muscle/:group', async (req: Request, res: Response) => {
    try {
      const muscleGroup = req.params.group;
      const exercises = await storage.getExercisesByMuscleGroup(muscleGroup);
      res.json(exercises);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get exercises' });
    }
  });
  
  // Get a specific exercise
  app.get('/api/exercise/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      const exercise = await storage.getExercise(id);
      
      if (!exercise) {
        return res.status(404).json({ message: 'Exercise not found' });
      }
      
      res.json(exercise);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get exercise' });
    }
  });
  
  // ==================== PROGRESS PHOTO ROUTES ====================
  
  // Get progress photos for a user
  app.get('/api/progress-photos/:userId', async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId, 10);
      const photos = await storage.getProgressPhotosByUserId(userId);
      res.json(photos);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get progress photos' });
    }
  });
  
  // Add a progress photo
  app.post('/api/progress-photo', async (req: Request, res: Response) => {
    try {
      const data = insertProgressPhotoSchema.parse(req.body);
      const photo = await storage.createProgressPhoto(data);
      res.status(201).json(photo);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid input', errors: error.format() });
      }
      res.status(500).json({ message: 'Failed to add progress photo' });
    }
  });
  
  // Delete a progress photo
  app.delete('/api/progress-photo/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      const success = await storage.deleteProgressPhoto(id);
      
      if (!success) {
        return res.status(404).json({ message: 'Progress photo not found' });
      }
      
      res.json({ message: 'Progress photo deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete progress photo' });
    }
  });
  
  // ==================== PROGRESS METRICS ROUTES ====================
  
  // Get progress metrics for a user
  app.get('/api/progress-metrics/:userId', async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId, 10);
      const metrics = await storage.getProgressMetricsByUserId(userId);
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get progress metrics' });
    }
  });
  
  // Add progress metrics
  app.post('/api/progress-metrics', async (req: Request, res: Response) => {
    try {
      const data = insertProgressMetricsSchema.parse(req.body);
      const metrics = await storage.createProgressMetrics(data);
      res.status(201).json(metrics);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid input', errors: error.format() });
      }
      res.status(500).json({ message: 'Failed to add progress metrics' });
    }
  });
  
  // ==================== AI WORKOUT PLAN GENERATION ====================
  
  // Generate a workout plan using Claude API
  app.post('/api/generate-workout-plan', async (req: Request, res: Response) => {
    try {
      const userId = req.body.userId;
      
      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }
      
      // Get user profile
      const userProfile = await storage.getUserProfile(userId);
      
      if (!userProfile) {
        return res.status(404).json({ message: 'User profile not found' });
      }
      
      // Generate workout plan
      const workoutPlan = await generateWorkoutPlan(userProfile);
      
      // Create a workout plan entry
      const planData = {
        userId,
        name: workoutPlan.planName,
        description: workoutPlan.planDescription,
        focus: workoutPlan.focus,
        duration: parseInt(workoutPlan.duration, 10),
        workoutType: userProfile.preferredWorkoutType,
        difficulty: userProfile.fitnessLevel,
        planData: workoutPlan,
        aiFeedback: workoutPlan.recommendations.progression
      };
      
      const savedPlan = await storage.createWorkoutPlan(planData);
      
      res.status(201).json(savedPlan);
    } catch (error) {
      console.error('Error generating workout plan:', error);
      res.status(500).json({ message: 'Failed to generate workout plan' });
    }
  });
  
  // ==================== AI HEALTH INSIGHTS ====================
  
  // Generate health insights from progress data
  app.post('/api/health-insights/:userId', async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId, 10);
      
      // Get user profile
      const userProfile = await storage.getUserProfile(userId);
      
      if (!userProfile) {
        return res.status(404).json({ message: 'User profile not found' });
      }
      
      // Get progress metrics
      const progressMetrics = await storage.getProgressMetricsByUserId(userId);
      
      if (progressMetrics.length === 0) {
        return res.status(400).json({ message: 'No progress data available' });
      }
      
      // Generate insights
      const insights = await generateHealthInsights(progressMetrics, userProfile);
      
      res.json({ insights });
    } catch (error) {
      res.status(500).json({ message: 'Failed to generate health insights' });
    }
  });
  
  // ==================== AI FITNESS QUESTIONS ====================
  
  // Answer a fitness question
  app.post('/api/fitness-question/:userId', async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId, 10);
      const { question } = req.body;
      
      if (!question) {
        return res.status(400).json({ message: 'Question is required' });
      }
      
      // Get user profile
      const userProfile = await storage.getUserProfile(userId);
      
      if (!userProfile) {
        return res.status(404).json({ message: 'User profile not found' });
      }
      
      // Generate answer
      const answer = await answerFitnessQuestion(question, userProfile);
      
      res.json({ question, answer });
    } catch (error) {
      res.status(500).json({ message: 'Failed to answer fitness question' });
    }
  });

  return httpServer;
}
