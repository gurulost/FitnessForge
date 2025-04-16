import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { WorkoutPlan, Exercise, LoggedWorkout } from "../lib/types";
import { apiRequest } from "../lib/queryClient";

// Workout Plans
export function useWorkoutPlans(userId: number | undefined) {
  return useQuery<WorkoutPlan[]>({
    queryKey: userId ? [`/api/workout-plans/${userId}`] : [],
    enabled: !!userId,
  });
}

export function useWorkoutPlan(id: number | undefined) {
  return useQuery<WorkoutPlan>({
    queryKey: id ? [`/api/workout-plan/${id}`] : [],
    enabled: !!id,
  });
}

export function useCreateWorkoutPlan() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Partial<WorkoutPlan>) => {
      const res = await apiRequest('POST', '/api/workout-plan', data);
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [`/api/workout-plans/${data.userId}`] });
    },
  });
}

export function useUpdateWorkoutPlan() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<WorkoutPlan> }) => {
      const res = await apiRequest('PUT', `/api/workout-plan/${id}`, data);
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [`/api/workout-plan/${data.id}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/workout-plans/${data.userId}`] });
    },
  });
}

export function useDeleteWorkoutPlan() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest('DELETE', `/api/workout-plan/${id}`, {});
      return res.json();
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [`/api/workout-plan/${id}`] });
      queryClient.invalidateQueries({ queryKey: ['/api/workout-plans'] });
    },
  });
}

// Exercises
export function useExercises() {
  return useQuery<Exercise[]>({
    queryKey: ['/api/exercises'],
  });
}

export function useExercisesByMuscleGroup(muscleGroup: string | undefined) {
  return useQuery<Exercise[]>({
    queryKey: muscleGroup ? [`/api/exercises/muscle/${muscleGroup}`] : [],
    enabled: !!muscleGroup,
  });
}

export function useExercise(id: number | undefined) {
  return useQuery<Exercise>({
    queryKey: id ? [`/api/exercise/${id}`] : [],
    enabled: !!id,
  });
}

// Logged Workouts
export function useLoggedWorkouts(userId: number | undefined) {
  return useQuery<LoggedWorkout[]>({
    queryKey: userId ? [`/api/logged-workouts/${userId}`] : [],
    enabled: !!userId,
  });
}

export function useLoggedWorkout(id: number | undefined) {
  return useQuery<LoggedWorkout>({
    queryKey: id ? [`/api/logged-workout/${id}`] : [],
    enabled: !!id,
  });
}

export function useLogWorkout() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Partial<LoggedWorkout>) => {
      const res = await apiRequest('POST', '/api/logged-workout', data);
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [`/api/logged-workouts/${data.userId}`] });
    },
  });
}

// AI-Generated Workout Plan
export function useGenerateWorkoutPlan() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userId: number) => {
      const res = await apiRequest('POST', '/api/generate-workout-plan', { userId });
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [`/api/workout-plans/${data.userId}`] });
    },
  });
}
