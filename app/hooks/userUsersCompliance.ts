import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";

import {
  fetchUserCompliance,
  UserComplianceReport,
} from "../lib/api/compliance";
import { ApiError } from "../lib/api/error";

interface UseUserComplianceOptions {
  options?: Omit<
    UseQueryOptions<
      UserComplianceReport,
      ApiError,
      UserComplianceReport,
      [string, string?]
    >,
    "queryKey" | "queryFn"
  >;
  organizationId: string;
}

export function useUsersCompliance(
  config: UseUserComplianceOptions
): UseQueryResult<UserComplianceReport, ApiError> {
  const { organizationId, options } = config;

  return useQuery<
    UserComplianceReport,
    ApiError,
    UserComplianceReport,
    [string, string?]
  >({
    queryKey: ["compliance.users", organizationId],
    queryFn: () => fetchUserCompliance(organizationId),
    refetchOnWindowFocus: false,
    refetchInterval: false,
    retry: false,
    ...options,
  });
}
