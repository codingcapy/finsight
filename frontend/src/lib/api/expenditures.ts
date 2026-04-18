import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { api, authHeaders } from "./client";
import { getSession } from "./plans";
import type {
  Expenditure,
  DeserializedExpenditure,
  CreateExpenditureArgs,
  DeleteExpenditureArgs,
  UpdateExpenditureArgs,
} from "./types";

export function mapSerializedExpenditureToSchema(
  serialized: Expenditure,
): DeserializedExpenditure {
  return {
    ...serialized,
    createdAt: new Date(serialized.createdAt),
  };
}

async function createExpenditure(args: CreateExpenditureArgs) {
  const token = getSession();
  const res = await api.post<{ expenditure: Expenditure }>(
    "/expenditures",
    args,
    {
      headers: authHeaders(token),
    },
  );
  return res.data;
}

export const useCreateExpenditureMutation = (
  onError?: (message: string) => void,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createExpenditure,
    onSettled: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["expenditures", data?.expenditure.planId],
      });
    },
    onError: (error) => {
      if (onError) {
        onError(error.message);
      }
    },
  });
};

async function getExpendituresByPlanId(planId: number) {
  const token = getSession();
  const res = await api.get<{ expenditures: Expenditure[] }>(
    `/expenditures/${planId}`,
    {
      headers: authHeaders(token),
    },
  );
  return res.data.expenditures.map(mapSerializedExpenditureToSchema);
}

export const getExpendituresByPlanIdQueryOptions = (planId: number) =>
  queryOptions({
    queryKey: ["expenditures", planId],
    queryFn: () => getExpendituresByPlanId(planId),
  });

async function deleteExpenditure(args: DeleteExpenditureArgs) {
  const token = getSession();
  const res = await api.post<{ expenditure: Expenditure }>(
    "/expenditures/delete",
    args,
    {
      headers: authHeaders(token),
    },
  );
  return res.data;
}

export const useDeleteExpenditureMutation = (
  onError?: (message: string) => void,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteExpenditure,
    onSettled: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["expenditures", data?.expenditure.planId],
      });
    },
    onError: (error) => {
      if (onError) {
        onError(error.message);
      }
    },
  });
};

async function UpdateExpenditures(args: UpdateExpenditureArgs) {
  const token = getSession();
  const res = await api.post<{ expenditure: Expenditure }>(
    "/expenditures/update",
    args,
    {
      headers: authHeaders(token),
    },
  );
  return res.data;
}

export const useUpdateExpenditureMutation = (
  onError?: (message: string) => void,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: UpdateExpenditures,
    onSettled: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["expenditures", data?.expenditure.planId],
      });
    },
    onError: (error) => {
      if (onError) {
        onError(error.message);
      }
    },
  });
};
