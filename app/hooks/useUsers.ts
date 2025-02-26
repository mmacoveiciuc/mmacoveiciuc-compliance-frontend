import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import { fetchUsers, User } from "../lib/api/users";
import { ApiError } from "../lib/api/error";

interface UseUsersOptions {
  options?: Omit<
    UseQueryOptions<User[], ApiError, User[], [string, string?]>,
    "queryKey" | "queryFn"
  >;
  organizationId: string;
}

export function useUsers(
  config: UseUsersOptions
): UseQueryResult<User[], Error> {
  const { organizationId, options } = config;

  return useQuery<User[], ApiError, User[], [string, string?]>({
    queryKey: ["users", organizationId],
    queryFn: () => fetchUsers(organizationId),
    refetchOnWindowFocus: false,
    refetchInterval: false,
    retry: false,
    ...options,
  });
}
