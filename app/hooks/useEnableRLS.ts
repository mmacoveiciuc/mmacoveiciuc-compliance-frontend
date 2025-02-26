import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from "@tanstack/react-query";
import { enableRLS, EnableRLSVariables } from "../lib/api/projects";
import { ApiError } from "../lib/api/error";

export type UseEnableRLSQueryOptions = Omit<
  UseMutationOptions<void, ApiError, EnableRLSVariables>,
  "mutationFn"
>;

export function useEnableRLSQuery(
  options?: UseEnableRLSQueryOptions
): UseMutationResult<void, ApiError, EnableRLSVariables> {
  return useMutation<void, ApiError, EnableRLSVariables>({
    mutationFn: enableRLS,
    retry: false,
    ...options,
  });
}
