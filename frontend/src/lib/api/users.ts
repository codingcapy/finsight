import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, authHeaders } from "./client";
import { getSession } from "./plans";
import useAuthStore from "../../store/AuthStore";
import type {
  User,
  CreateUserArgs,
  UpdateCurrentPlanArgs,
  UpdatePasswordArgs,
  ResetPasswordArgs,
} from "./types";

async function createUser(args: CreateUserArgs) {
  const res = await api.post<{ user: User }>("/users", args);
  if (!res.data.user) {
    throw new Error("Invalid response from server");
  }
  return res.data.user;
}

export const useCreateUserMutation = (onError?: (message: string) => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createUser,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      if (onError) {
        onError(error.message);
      }
    },
  });
};

async function updateCurrentPlan(args: UpdateCurrentPlanArgs) {
  const token = getSession();
  const res = await api.post<{ user: User }>(
    "/users/update/currentplan",
    args,
    {
      headers: authHeaders(token),
    },
  );
  return res.data;
}

export const useUpdateCurrentPlanMutation = (
  onError?: (message: string) => void,
) => {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();
  return useMutation({
    mutationFn: updateCurrentPlan,
    onSettled: (_data, _error) => {
      if (!_data) return console.log("No data, returning");
      setUser({ ..._data.user, createdAt: new Date(_data.user.createdAt) });
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
      queryClient.invalidateQueries({
        queryKey: ["plan", _data.user.currentPlan.toString()],
      });
      queryClient.invalidateQueries({
        queryKey: ["incomes", _data.user.currentPlan],
      });
    },
    onError: (error) => {
      if (onError) {
        onError(error.message);
      }
    },
  });
};

async function resetPassword(args: ResetPasswordArgs) {
  const token = getSession();
  const res = await api.post<{ message: string }>(
    "/users/passwordreset",
    args,
    {
      headers: authHeaders(token),
    },
  );
  return res.data;
}

export const useResetPasswordMutation = (
  onError?: (message: string) => void,
) => {
  return useMutation({
    mutationFn: resetPassword,
    onSettled: (data, _error) => {
      if (!data) return console.log("No data, returning");
      console.log(data);
    },
    onError: (error) => {
      if (onError) {
        onError(error.message);
      }
    },
  });
};

async function UpdatePassword(args: UpdatePasswordArgs) {
  const token = getSession();
  const res = await api.post<{ message: string }>(
    "/users/update/password",
    args,
    {
      headers: authHeaders(token),
    },
  );
  return res.data;
}

export const useUpdatePasswordMutation = (
  onError?: (message: string) => void,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: UpdatePassword,
    onSettled: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
    onError: (error) => {
      if (onError) {
        onError(error.message);
      }
    },
  });
};
