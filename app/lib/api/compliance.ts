import { ApiError } from "./error";
import { tryReadJSONBody } from "./parse";
import { User } from "./users";

export interface ComplianceRule {
  name: string;
  description: string;
}

export interface ComplianceIssueFix {
  name: string;
  description: string;
}

export interface ComplianceLineItem<T> {
  item: T;
  breached?: ComplianceRule[];
  fix?: ComplianceIssueFix[];
}

export interface ComplianceReport<T> {
  lineItems: ComplianceLineItem<T>[];
  passing: boolean;
}

interface ProjectComplianceData {
  id: string;
  name: string;
  organization_id: string;
  region: string;
}

interface TableComplianceData {
  project_id: string;
  table_name: string;
  schema_name: string;
}

export type ProjectComplianceReport = ComplianceReport<ProjectComplianceData>;
export type TableComplianceReport = ComplianceReport<TableComplianceData>;
export type UserComplianceReport = ComplianceReport<User>;

export async function fetchProjectCompliance(
  organization_id: string
): Promise<ProjectComplianceReport> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_PATH}/v1/compliance/${organization_id}/projects`,
    {
      credentials: "include",
      mode: "cors",
    }
  );
  if (!res.ok) {
    const body = tryReadJSONBody(res);
    throw new ApiError(
      "error fetching compliance data for projects",
      res.status,
      JSON.stringify(body)
    );
  }
  return res.json();
}

export async function fetchTableCompliance(
  organization_id: string
): Promise<TableComplianceReport> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_PATH}/v1/compliance/${organization_id}/tables`,
    {
      credentials: "include",
      mode: "cors",
    }
  );
  if (!res.ok) {
    const body = tryReadJSONBody(res);
    throw new ApiError(
      "error fetching compliance data for tables",
      res.status,
      JSON.stringify(body)
    );
  }
  return res.json();
}

export async function fetchUserCompliance(
  organization_id: string
): Promise<UserComplianceReport> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_PATH}/v1/compliance/${organization_id}/users`,
    {
      credentials: "include",
      mode: "cors",
    }
  );
  if (!res.ok) {
    const body = tryReadJSONBody(res);
    throw new ApiError(
      "error fetching compliance data for users",
      res.status,
      JSON.stringify(body)
    );
  }
  return res.json();
}

export async function fetchComplianceLogs(
  organization_id: string,
  resource?: string
) {
  const params = new URLSearchParams();
  if (resource) {
    params.set("resource", resource);
  }
  const res = await fetch(
    `${
      process.env.NEXT_PUBLIC_API_PATH
    }/v1/compliance/${organization_id}/logs?${params.toString()}`,
    {
      credentials: "include",
      mode: "cors",
    }
  );
  if (!res.ok) {
    const body = tryReadJSONBody(res);
    throw new ApiError(
      "error fetching compliance logs",
      res.status,
      JSON.stringify(body)
    );
  }
  return res.json();
}
