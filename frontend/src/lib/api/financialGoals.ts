import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { api, authHeaders } from "./client";
import { getSession } from "./plans";
import type {
  FinancialGoal,
  DeserializedFinancialGoal,
  CreateFinancialGoalArgs,
  DeleteFinancialGoalArgs,
  UpdateFinancialGoalArgs,
} from "./types";

export function mapSerializedFinancialGoalToSchema(
  serialized: FinancialGoal,
): DeserializedFinancialGoal {
  return {
    ...serialized,
    targetDate: new Date(serialized.targetDate),
    createdAt: new Date(serialized.createdAt),
  };
}

async function createFinancialGoal(args: CreateFinancialGoalArgs) {
  const token = getSession();
  const res = await api.post<{ financialGoal: FinancialGoal }>(
    "/financialgoals",
    args,
    {
      headers: authHeaders(token),
    },
  );
  return res.data;
}

export const useCreateFinancialGoalMutation = (
  onError?: (message: string) => void,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createFinancialGoal,
    onSettled: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["financialGoals", data?.financialGoal.planId],
      });
    },
    onError: (error) => {
      if (onError) {
        onError(error.message);
      }
    },
  });
};

async function getFinancialGoalsByPlanId(planId: number) {
  const token = getSession();
  const res = await api.get<{ financialGoals: FinancialGoal[] }>(
    `/financialgoals/${planId}`,
    {
      headers: authHeaders(token),
    },
  );
  return res.data.financialGoals.map(mapSerializedFinancialGoalToSchema);
}

export const getFinancialGoalsByPlanIdQueryOptions = (planId: number) =>
  queryOptions({
    queryKey: ["financialGoals", planId],
    queryFn: () => getFinancialGoalsByPlanId(planId),
  });

async function deleteFinancialGoal(args: DeleteFinancialGoalArgs) {
  const token = getSession();
  const res = await api.post<{ financialGoal: FinancialGoal }>(
    "/financialgoals/delete",
    args,
    {
      headers: authHeaders(token),
    },
  );
  return res.data;
}

export const useDeleteFinancialGoalMutation = (
  onError?: (message: string) => void,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteFinancialGoal,
    onSettled: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["financialGoals", data?.financialGoal.planId],
      });
    },
    onError: (error) => {
      if (onError) {
        onError(error.message);
      }
    },
  });
};

async function UpdateFinancialGoal(args: UpdateFinancialGoalArgs) {
  const token = getSession();
  const res = await api.post<{ financialGoal: FinancialGoal }>(
    "/financialgoals/update",
    args,
    {
      headers: authHeaders(token),
    },
  );
  return res.data;
}

export const useUpdateFinancialGoalMutation = (
  onError?: (message: string) => void,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: UpdateFinancialGoal,
    onSettled: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["financialGoals", data?.financialGoal.planId],
      });
    },
    onError: (error) => {
      if (onError) {
        onError(error.message);
      }
    },
  });
};
