import { ApiError } from "./error";
import { tryReadJSONBody } from "./parse";

export interface User {
  user_id: string;
  user_name: string;
  email: string;
  role_name: string;
  mfa_enabled: boolean;
}

export async function fetchUsers(organization: string): Promise<User[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_PATH}/v1/organizations/${organization}/members`,
    {
      credentials: "include",
      mode: "cors",
    }
  );
  if (!res.ok) {
    const body = tryReadJSONBody(res);
    throw new ApiError(
      "error fetching users",
      res.status,
      JSON.stringify(body)
    );
  }
  return res.json();
}
