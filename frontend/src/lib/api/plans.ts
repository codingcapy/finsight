import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { api, authHeaders } from "./client";
import useAuthStore from "../../store/AuthStore";
import type {
  Plan,
  User,
  DeserializedPlan,
  CreatePlanArgs,
  DeletePlanArgs,
  UpdatePlanArgs,
  UpdateCurrencyArgs,
  UpdateYearOfBirthArgs,
  UpdateLocationArgs,
} from "./types";

export function mapSerializedPlanToSchema(serialized: Plan): DeserializedPlan {
  return {
    ...serialized,
    createdAt: new Date(serialized.createdAt),
  };
}

const TOKEN_KEY = "jwt_access_token";

export function getSession() {
  return localStorage.getItem(TOKEN_KEY);
}

async function createPlan(args: CreatePlanArgs) {
  const token = getSession();
  const res = await api.post<{ plan: Plan; user: User }>("/plans", args, {
    headers: authHeaders(token),
  });
  return res.data;
}

export const useCreatePlanMutation = (onError?: (message: string) => void) => {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();
  return useMutation({
    mutationFn: createPlan,
    onSuccess: (data) => {
      setUser({ ...data.user, createdAt: new Date(data.user.createdAt) });
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      queryClient.invalidateQueries({
        queryKey: ["plan", data.user.currentPlan],
      });
    },
    onError: (error) => {
      if (onError) {
        onError(error.message);
      }
    },
  });
};

async function getPlans() {
  const token = getSession();
  const res = await api.get<{ plans: Plan[] }>("/plans", {
    headers: authHeaders(token),
  });
  return res.data.plans.map(mapSerializedPlanToSchema);
}

export const getPlansQueryOptions = () =>
  queryOptions({
    queryKey: ["plans"],
    queryFn: () => getPlans(),
  });

async function getPlanById(planId: number) {
  const token = getSession();
  const res = await api.get<{ plan: Plan }>(`/plans/${planId}`, {
    headers: authHeaders(token),
  });
  return mapSerializedPlanToSchema(res.data.plan);
}

export const getPlanByIdQueryOptions = (planId: number) =>
  queryOptions({
    queryKey: ["plan", planId],
    queryFn: () => getPlanById(planId),
  });

async function deletePlan(args: DeletePlanArgs) {
  const token = getSession();
  const res = await api.post<{ user: User }>("/plans/delete", args, {
    headers: authHeaders(token),
  });
  return res.data;
}

export const useDeletePlanMutation = (onError?: (message: string) => void) => {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();
  return useMutation({
    mutationFn: deletePlan,
    onSettled: (data, _error) => {
      if (!data) return console.log("No data, returning");
      setUser({ ...data.user, createdAt: new Date(data.user.createdAt) });
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      queryClient.invalidateQueries({
        queryKey: ["plan", data.user.currentPlan],
      });
    },
    onError: (error) => {
      if (onError) {
        onError(error.message);
      }
    },
  });
};

async function updatePlan(args: UpdatePlanArgs) {
  const token = getSession();
  const res = await api.post<{ plan: Plan }>("/plans/update", args, {
    headers: authHeaders(token),
  });
  return res.data;
}

export const useUpdatePlanMutation = (onError?: (message: string) => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updatePlan,
    onSettled: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["plan", data?.plan.planId],
      });
    },
    onError: (error) => {
      if (onError) {
        onError(error.message);
      }
    },
  });
};

async function updateCurrency(args: UpdateCurrencyArgs) {
  const token = getSession();
  const res = await api.post<{ plan: Plan }>("/plans/update/currency", args, {
    headers: authHeaders(token),
  });
  return res.data;
}

export const useUpdateCurrencyMutation = (
  onError?: (message: string) => void,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCurrency,
    onSettled: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["plan", data?.plan.planId],
      });
    },
    onError: (error) => {
      if (onError) {
        onError(error.message);
      }
    },
  });
};

async function updateYearOfBirth(args: UpdateYearOfBirthArgs) {
  const token = getSession();
  const res = await api.post<{ plan: Plan }>(
    "/plans/update/yearofbirth",
    args,
    {
      headers: authHeaders(token),
    },
  );
  return res.data;
}

export const useUpdateYearOfBirthMutation = (
  onError?: (message: string) => void,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateYearOfBirth,
    onSettled: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["plan", data?.plan.planId],
      });
    },
    onError: (error) => {
      if (onError) {
        onError(error.message);
      }
    },
  });
};

async function updateLocation(args: UpdateLocationArgs) {
  const token = getSession();
  const res = await api.post<{ plan: Plan }>("/plans/update/location", args, {
    headers: authHeaders(token),
  });
  return res.data;
}

export const useUpdateLocationMutation = (
  onError?: (message: string) => void,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateLocation,
    onSettled: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["plan", data?.plan.planId],
      });
    },
    onError: (error) => {
      if (onError) {
        onError(error.message);
      }
    },
  });
};
