import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { api, authHeaders } from "./client";
import { getSession } from "./plans";
import type {
  Asset,
  DeserializedAsset,
  CreateAssetArgs,
  DeleteAssetArgs,
  UpdateAssetArgs,
} from "./types";

export function mapSerializedAssetToSchema(
  serialized: Asset,
): DeserializedAsset {
  return {
    ...serialized,
    createdAt: new Date(serialized.createdAt),
  };
}

async function createAsset(args: CreateAssetArgs) {
  const token = getSession();
  const res = await api.post<{ asset: Asset }>("/assets", args, {
    headers: authHeaders(token),
  });
  return res.data;
}

export const useCreateAssetMutation = (onError?: (message: string) => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAsset,
    onSettled: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["assets", data?.asset.planId],
      });
    },
    onError: (error) => {
      if (onError) {
        onError(error.message);
      }
    },
  });
};

async function getAssetsByPlanId(planId: number) {
  const token = getSession();
  const res = await api.get<{ assets: Asset[] }>(`/assets/${planId}`, {
    headers: authHeaders(token),
  });
  return res.data.assets.map(mapSerializedAssetToSchema);
}

export const getAssetsByPlanIdQueryOptions = (planId: number) =>
  queryOptions({
    queryKey: ["assets", planId],
    queryFn: () => getAssetsByPlanId(planId),
  });

async function deleteAsset(args: DeleteAssetArgs) {
  const token = getSession();
  const res = await api.post<{ asset: Asset }>("/assets/delete", args, {
    headers: authHeaders(token),
  });
  return res.data;
}

export const useDeleteAssetMutation = (onError?: (message: string) => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAsset,
    onSettled: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["assets", data?.asset.planId],
      });
    },
    onError: (error) => {
      if (onError) {
        onError(error.message);
      }
    },
  });
};

async function UpdateAsset(args: UpdateAssetArgs) {
  const token = getSession();
  const res = await api.post<{ asset: Asset }>("/assets/update", args, {
    headers: authHeaders(token),
  });
  return res.data;
}

export const useUpdateAssetMutation = (onError?: (message: string) => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: UpdateAsset,
    onSettled: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["assets", data?.asset.planId],
      });
    },
    onError: (error) => {
      if (onError) {
        onError(error.message);
      }
    },
  });
};
