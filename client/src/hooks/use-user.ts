import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { User, CreateUserRequest, LoginRequest, UserProfile } from "../lib/types";
import { apiRequest } from "../lib/queryClient";

export function useCurrentUser() {
  return useQuery<User | null>({
    queryKey: ['/api/auth/user'],
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      const res = await apiRequest('POST', '/api/auth/login', data);
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['/api/auth/user'], data);
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateUserRequest) => {
      const res = await apiRequest('POST', '/api/auth/register', data);
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['/api/auth/user'], data);
    },
  });
}

export function useUserProfile(userId: number | undefined) {
  return useQuery<UserProfile>({
    queryKey: userId ? [`/api/profile/${userId}`] : [],
    enabled: !!userId,
    refetchOnWindowFocus: false,
  });
}

export function useUpdateUserProfile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Partial<UserProfile>) => {
      const res = await apiRequest('POST', '/api/profile', data);
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [`/api/profile/${data.userId}`] });
      
      // Also update the current user to reflect onboarded status
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
    },
  });
}

export function useHealthInsights(userId: number | undefined) {
  return useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error('User ID is required');
      const res = await apiRequest('POST', `/api/health-insights/${userId}`, {});
      return res.json();
    },
  });
}

export function useFitnessQuestion(userId: number | undefined) {
  return useMutation({
    mutationFn: async (question: string) => {
      if (!userId) throw new Error('User ID is required');
      const res = await apiRequest('POST', `/api/fitness-question/${userId}`, { question });
      return res.json();
    },
  });
}
