import { ApiError } from "./error";
import { tryReadJSONBody } from "./parse";

export interface Project {
  id: string;
  organization_id: string;
  name: string;
  region: string;
  created_at: string;
  status: string;
  database: {
    host: string;
    version: string;
    postgres_engine: string;
    release_channel: string;
  };
}

export interface DatabaseQueryVariables {
  projectId: string;
  query: string;
}

export interface EnableRLSVariables {
  projectId: string;
  table: string;
  schema: string;
  org: string;
}

export type DatabaseQueryResult = unknown;

export async function fetchProjects(): Promise<Project[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}/v1/projects`, {
    credentials: "include",
    mode: "cors",
  });
  if (!res.ok) {
    const body = tryReadJSONBody(res);
    throw new ApiError(
      "error fetching projects",
      res.status,
      JSON.stringify(body)
    );
  }
  return res.json();
}

export async function runSQLQuery(
  variables: DatabaseQueryVariables
): Promise<DatabaseQueryResult> {
  const { projectId, query } = variables;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_PATH}/v1/projects/${projectId}/database/query`,
    {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ query }),
    }
  );

  if (!res.ok) {
    const body = tryReadJSONBody(res);
    throw new ApiError(
      "error querying database:",
      res.status,
      JSON.stringify(body)
    );
  }

  return res.json();
}

export async function enableRLS(variables: EnableRLSVariables): Promise<void> {
  const { table, schema, projectId, org } = variables;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_PATH}/v1/projects/${projectId}/database/query/enable_rls`,
    {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ table, schema, org }),
    }
  );

  if (!res.ok) {
    const body = tryReadJSONBody(res);
    throw new ApiError(
      "error enable RLS on table",
      res.status,
      JSON.stringify(body)
    );
  }

  return;
}
