import { useQuery } from "@tanstack/react-query";
import { fetchOrganizations, Organization } from "../lib/api/organizations";
import { ApiError } from "../lib/api/error";

export function useOrganizations() {
  return useQuery<Organization[], ApiError>({
    refetchOnWindowFocus: false,
    refetchInterval: false,
    retry: false,
    queryKey: ["organizations"],
    queryFn: fetchOrganizations,
  });
}
