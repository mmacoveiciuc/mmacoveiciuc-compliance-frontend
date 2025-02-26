import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { ArrowRightCircle } from "lucide-react";

const SUPABASE_OAUTH_BASE_URL = "https://api.supabase.com/v1/oauth/authorize";
const SUPABASE_CLIENT_ID = process.env.NEXT_PUBLIC_SUPABASE_OAUTH_CLIENT_ID ?? "";
const SUPABASE_REDIRECT_URI = process.env.NEXT_PUBLIC_SUPABASE_OAUTH_REDIRECT_URI ?? "";
const SUPABASE_RESPONSE_TYPE = "code";

const buildOAuthRedirect = (): string => {
  const params = new URLSearchParams();
  params.set("client_id", SUPABASE_CLIENT_ID);
  params.set("redirect_uri", SUPABASE_REDIRECT_URI);
  params.set("response_type", SUPABASE_RESPONSE_TYPE);
  return `${SUPABASE_OAUTH_BASE_URL}?${params.toString()}`;
}

export default function Login() {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <Card className="w-sm h-min">
        <CardHeader>
          <CardTitle>Supabase Compliance</CardTitle>
          <CardDescription>Checks your compliance across users, tables, and more!</CardDescription>
        </CardHeader>
        <CardContent>
          <a href={buildOAuthRedirect()}>
            <Button className="w-full" size={"lg"}>
              Login with Supabase
              <ArrowRightCircle />
            </Button>
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
