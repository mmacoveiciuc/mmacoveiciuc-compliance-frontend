import { ApiError } from "./error";

export interface Organization {
  id: string;
  name: string;
}

export async function fetchOrganizations(): Promise<Organization[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_PATH}/v1/organizations`,
    {
      credentials: "include",
      mode: "cors",
    }
  );
  if (!res.ok) {
    const body = res.body ? await res.json() : undefined;
    throw new ApiError(
      "error fetching organizations",
      res.status,
      JSON.stringify(body)
    );
  }
  return res.json();
}
