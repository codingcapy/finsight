import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { api, authHeaders } from "./client";
import { getSession } from "./plans";
import type {
  Liability,
  DeserializedLiability,
  CreateLiabilityArgs,
  DeleteLiabilityArgs,
  UpdateLiabilityArgs,
} from "./types";

export function mapSerializedLiabilityToSchema(
  serialized: Liability,
): DeserializedLiability {
  return {
    ...serialized,
    createdAt: new Date(serialized.createdAt),
  };
}

async function createLiability(args: CreateLiabilityArgs) {
  const token = getSession();
  const res = await api.post<{ liability: Liability }>("/liabilities", args, {
    headers: authHeaders(token),
  });
  return res.data;
}

export const useCreateLiabilityMutation = (
  onError?: (message: string) => void,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createLiability,
    onSettled: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["liabilities", data?.liability.planId],
      });
    },
    onError: (error) => {
      if (onError) {
        onError(error.message);
      }
    },
  });
};

async function getLiabilitiesByPlanId(planId: number) {
  const token = getSession();
  const res = await api.get<{ liabilities: Liability[] }>(
    `/liabilities/${planId}`,
    {
      headers: authHeaders(token),
    },
  );
  return res.data.liabilities.map(mapSerializedLiabilityToSchema);
}

export const getLiabilitiesByPlanIdQueryOptions = (planId: number) =>
  queryOptions({
    queryKey: ["liabilities", planId],
    queryFn: () => getLiabilitiesByPlanId(planId),
  });

async function deleteLiability(args: DeleteLiabilityArgs) {
  const token = getSession();
  const res = await api.post<{ liability: Liability }>(
    "/liabilities/delete",
    args,
    {
      headers: authHeaders(token),
    },
  );
  return res.data;
}

export const useDeleteLiabilityMutation = (
  onError?: (message: string) => void,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteLiability,
    onSettled: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["liabilities", data?.liability.planId],
      });
    },
    onError: (error) => {
      if (onError) {
        onError(error.message);
      }
    },
  });
};

async function UpdateLiability(args: UpdateLiabilityArgs) {
  const token = getSession();
  const res = await api.post<{ liability: Liability }>(
    "/liabilities/update",
    args,
    {
      headers: authHeaders(token),
    },
  );
  return res.data;
}

export const useUpdateLiabilityMutation = (
  onError?: (message: string) => void,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: UpdateLiability,
    onSettled: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["liabilities", data?.liability.planId],
      });
    },
    onError: (error) => {
      if (onError) {
        onError(error.message);
      }
    },
  });
};
