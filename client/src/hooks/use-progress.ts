import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProgressPhoto, ProgressMetrics } from "../lib/types";
import { apiRequest } from "../lib/queryClient";

// Progress Photos
export function useProgressPhotos(userId: number | undefined) {
  return useQuery<ProgressPhoto[]>({
    queryKey: userId ? [`/api/progress-photos/${userId}`] : [],
    enabled: !!userId,
  });
}

export function useAddProgressPhoto() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { userId: number, photoUrl: string, caption?: string }) => {
      const res = await apiRequest('POST', '/api/progress-photo', data);
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [`/api/progress-photos/${data.userId}`] });
    },
  });
}

export function useDeleteProgressPhoto() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, userId }: { id: number, userId: number }) => {
      const res = await apiRequest('DELETE', `/api/progress-photo/${id}`, {});
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [`/api/progress-photos/${variables.userId}`] });
    },
  });
}

// Progress Metrics
export function useProgressMetrics(userId: number | undefined) {
  return useQuery<ProgressMetrics[]>({
    queryKey: userId ? [`/api/progress-metrics/${userId}`] : [],
    enabled: !!userId,
  });
}

export function useAddProgressMetrics() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Partial<ProgressMetrics>) => {
      const res = await apiRequest('POST', '/api/progress-metrics', data);
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [`/api/progress-metrics/${data.userId}`] });
    },
  });
}
