import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import { fetchProjects, Project } from "../lib/api/projects";
import { ApiError } from "../lib/api/error";

interface UseProjectsOptions {
  options?: Omit<
    UseQueryOptions<Project[], ApiError, Project[], [string]>,
    "queryKey" | "queryFn"
  >;
}

export function useProjects(
  config: UseProjectsOptions
): UseQueryResult<Project[], ApiError> {
  const { options } = config;

  return useQuery<Project[], ApiError, Project[], [string]>({
    queryKey: ["projects"],
    queryFn: fetchProjects,
    refetchOnWindowFocus: false,
    refetchInterval: false,
    retry: false,
    ...options,
  });
}
