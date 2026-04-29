import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { api, authHeaders } from "./client";
import { getSession } from "./plans";
import type {
  Generation,
  DeserializedGeneration,
  CreateGenerationArgs,
  DeleteGenerationArgs,
  PaginatedGenerationsResponse,
} from "./types";

export function mapSerializedGenerationToSchema(
  serialized: Generation,
): DeserializedGeneration {
  return {
    ...serialized,
    createdAt: new Date(serialized.createdAt),
  };
}

async function createGeneration(args: CreateGenerationArgs) {
  const token = getSession();
  const res = await api.post<{ generation: Generation }>("/ai/generate", args, {
    headers: authHeaders(token),
  });
  return res.data;
}

export const useCreateGenerationMutation = (
  onError?: (message: string) => void,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createGeneration,
    onSettled: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["generations", data?.generation.planId],
      });
    },
    onError: (error) => {
      if (onError) {
        onError(error.message);
      }
    },
  });
};

async function getGenerationsByPlanId(planId: number, page: number) {
  const token = getSession();
  const res = await api.get<PaginatedGenerationsResponse>(
    `/generations/${planId}`,
    {
      headers: authHeaders(token),
      params: { page, pageSize: 5 },
    },
  );
  return {
    generations: res.data.generations.map(mapSerializedGenerationToSchema),
    hasMore: res.data.hasMore,
  };
}

export const useInfiniteGenerationsByPlanIdQuery = (planId: number) =>
  useInfiniteQuery({
    queryKey: ["generations", planId],
    queryFn: ({ pageParam }) =>
      getGenerationsByPlanId(planId, pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore ? allPages.length + 1 : undefined,
    enabled: !!planId,
  });

async function deleteGeneration(args: DeleteGenerationArgs) {
  const token = getSession();
  const res = await api.post<{ generation: Generation }>(
    "/generations/delete",
    args,
    {
      headers: authHeaders(token),
    },
  );
  return res.data;
}

export const useDeleteGenerationMutation = (
  onError?: (message: string) => void,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteGeneration,
    onSettled: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["generations", data?.generation.planId],
      });
    },
    onError: (error) => {
      if (onError) {
        onError(error.message);
      }
    },
  });
};
