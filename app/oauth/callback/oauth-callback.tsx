"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ErrorAlert from "@/components/error-alert";
import { Spinner } from "@/components/spinner";

export default function OAuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!code) return;

    async function exchangeCodeForTokens() {
      try {
        const response = await fetch(`/api/oauth/callback?code=${code}`);
        if (response.ok) {
          router.replace("/");
        } else {
          setErr("Failed to exchange token, try logging in again.");
          console.error("Failed to exchange token");
        }
      } catch (error) {
        console.error("Error exchanging code:", error);
        setErr(String(err));
      }
    }

    exchangeCodeForTokens();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, router, setErr]);

  return (
    <Suspense>
      <div className="w-screen h-screen flex justify-center items-center p-10">
        <div className="flex flex-col gap-2 max-w-[400px]">
          {!err && <Spinner />}
          {err && (
            <ErrorAlert
              title="Failed sign in with Supabase"
              description={err}
              code={500}
            />
          )}
        </div>
      </div>
    </Suspense>
  );
}
