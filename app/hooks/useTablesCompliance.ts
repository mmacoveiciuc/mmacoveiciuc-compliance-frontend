import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import { ApiError } from "../lib/api/error";

import {
  fetchTableCompliance,
  TableComplianceReport,
} from "../lib/api/compliance";

interface UseTablesComplianceOptions {
  options?: Omit<
    UseQueryOptions<
      TableComplianceReport,
      ApiError,
      TableComplianceReport,
      [string, string?]
    >,
    "queryKey" | "queryFn"
  >;
  organizationId: string;
}

export function useTablesCompliance(
  config: UseTablesComplianceOptions
): UseQueryResult<TableComplianceReport, ApiError> {
  const { organizationId, options } = config;

  return useQuery<
    TableComplianceReport,
    ApiError,
    TableComplianceReport,
    [string, string?]
  >({
    queryKey: ["compliance.tables", organizationId],
    queryFn: () => fetchTableCompliance(organizationId),
    refetchOnWindowFocus: false,
    refetchInterval: false,
    retry: false,
    ...options,
  });
}
