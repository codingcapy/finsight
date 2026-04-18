import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { api, authHeaders } from "./client";
import { getSession } from "./plans";
import type {
  Income,
  DeserializedIncome,
  CreateIncomeArgs,
  DeleteIncomeArgs,
  UpdateIncomeArgs,
} from "./types";

export function mapSerializedIncomeToSchema(
  serialized: Income,
): DeserializedIncome {
  return {
    ...serialized,
    createdAt: new Date(serialized.createdAt),
  };
}

async function createIncome(args: CreateIncomeArgs) {
  const token = getSession();
  const res = await api.post<{ income: Income }>("/incomes", args, {
    headers: authHeaders(token),
  });
  return res.data;
}

export const useCreateIncomeMutation = (
  onError?: (message: string) => void,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createIncome,
    onSettled: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["incomes", data?.income.planId],
      });
    },
    onError: (error) => {
      if (onError) {
        onError(error.message);
      }
    },
  });
};

async function getIncomesByPlanId(planId: number) {
  const token = getSession();
  const res = await api.get<{ incomes: Income[] }>(`/incomes/${planId}`, {
    headers: authHeaders(token),
  });
  return res.data.incomes.map(mapSerializedIncomeToSchema);
}

export const getIncomesByPlanIdQueryOptions = (planId: number) =>
  queryOptions({
    queryKey: ["incomes", planId],
    queryFn: () => getIncomesByPlanId(planId),
  });

async function deleteIncome(args: DeleteIncomeArgs) {
  const token = getSession();
  const res = await api.post<{ income: Income }>("/incomes/delete", args, {
    headers: authHeaders(token),
  });
  return res.data;
}

export const useDeleteIncomeMutation = (
  onError?: (message: string) => void,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteIncome,
    onSettled: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["incomes", data?.income.planId],
      });
    },
    onError: (error) => {
      if (onError) {
        onError(error.message);
      }
    },
  });
};

async function UpdateIncome(args: UpdateIncomeArgs) {
  const token = getSession();
  const res = await api.post<{ income: Income }>("/incomes/update", args, {
    headers: authHeaders(token),
  });
  return res.data;
}

export const useUpdateIncomeMutation = (
  onError?: (message: string) => void,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: UpdateIncome,
    onSettled: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["incomes", data?.income.planId],
      });
    },
    onError: (error) => {
      if (onError) {
        onError(error.message);
      }
    },
  });
};
