import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";

import { fetchComplianceLogs } from "../lib/api/compliance";
import { ApiError } from "../lib/api/error";

export interface ComplianceLog {
  id: number;
  org: string;
  createdAt: string;
  updatedAt: string;
  resource: string;
  previous: string;
  current: string;
  description: string;
}

interface UseComplianceLogsOptions {
  options?: Omit<
    UseQueryOptions<
      ComplianceLog[],
      ApiError,
      ComplianceLog[],
      [string, string?, string?]
    >,
    "queryKey" | "queryFn"
  >;
  organizationId: string;
  resource?: string;
}

export function useComplianceLogs(
  config: UseComplianceLogsOptions
): UseQueryResult<ComplianceLog[], ApiError> {
  const { organizationId, resource, options } = config;

  return useQuery<
    ComplianceLog[],
    ApiError,
    ComplianceLog[],
    [string, string?, string?]
  >({
    queryKey: ["compliance.logs", resource, organizationId],
    queryFn: () => fetchComplianceLogs(organizationId, resource),
    refetchOnWindowFocus: false,
    refetchInterval: false,
    retry: false,
    ...options,
  });
}
