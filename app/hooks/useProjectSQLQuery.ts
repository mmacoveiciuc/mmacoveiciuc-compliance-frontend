import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from "@tanstack/react-query";
import {
  runSQLQuery,
  DatabaseQueryVariables,
  DatabaseQueryResult,
} from "../lib/api/projects";
import { ApiError } from "../lib/api/error";

export type UseProjectSQLQueryOptions = Omit<
  UseMutationOptions<DatabaseQueryResult, ApiError, DatabaseQueryVariables>,
  "mutationFn"
>;

export function useProjectSQLQuery(
  options?: UseProjectSQLQueryOptions
): UseMutationResult<DatabaseQueryResult, ApiError, DatabaseQueryVariables> {
  return useMutation<DatabaseQueryResult, ApiError, DatabaseQueryVariables>({
    mutationFn: runSQLQuery,
    retry: false,
    ...options,
  });
}
