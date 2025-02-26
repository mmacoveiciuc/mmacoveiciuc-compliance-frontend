import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";

import {
  fetchProjectCompliance,
  ProjectComplianceReport,
} from "../lib/api/compliance";
import { ApiError } from "../lib/api/error";

interface UseProjectComplianceOptions {
  options?: Omit<
    UseQueryOptions<
      ProjectComplianceReport,
      ApiError,
      ProjectComplianceReport,
      [string, string?]
    >,
    "queryKey" | "queryFn"
  >;
  organizationId: string;
}

export function useProjectCompliance(
  config: UseProjectComplianceOptions
): UseQueryResult<ProjectComplianceReport, ApiError> {
  const { organizationId, options } = config;

  return useQuery<
    ProjectComplianceReport,
    ApiError,
    ProjectComplianceReport,
    [string, string?]
  >({
    queryKey: ["compliance.projects", organizationId],
    queryFn: () => fetchProjectCompliance(organizationId),
    refetchOnWindowFocus: false,
    refetchInterval: false,
    retry: false,
    ...options,
  });
}
