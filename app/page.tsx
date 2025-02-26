"use client";

import { useEffect } from "react";
import { useOrganizations } from "./hooks/useOrganizations";
import OrganizationCard from "@/components/organization-card";
import { redirect } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Slash } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function Home() {
  const {
    data: organizations,
    isLoading: isOrganizationsLoading,
    error,
    status,
  } = useOrganizations();

  useEffect(() => {
    if (error && error.code === 401) {
      redirect("/login");
    }
  }, [error, status]);

  return (
    <div className="flex flex-col align-center p-10 w-full h-full items-center">
      <div className="flex flex-col lg:w-5xl w-full">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Organizations</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <Slash />
            </BreadcrumbSeparator>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-xl font-bold pt-2">Choose an organization</h1>
        <p className="text-md">
          Compliance is scanned on a per organization level. Some settings are
          shared across organizations such as the team members under your
          account.
        </p>
        <div className="py-2">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{error.message}</AlertTitle>
              <AlertDescription>{error.description}</AlertDescription>
            </Alert>
          )}
        </div>
        <div className="flex flex-row flex-wrap items-center gap-4 rounded-md">
          {organizations?.map((org) => (
            <div key={org.id} className="flex-1 lg:max-w-[50%] w-full">
              <OrganizationCard
                id={org.id}
                href={`/compliance/${org.id}`}
                title={org.name}
              />
            </div>
          ))}
          {isOrganizationsLoading &&
            Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="flex-1 max-w-[50%]">
                <OrganizationCard id={""} title={""} href="" isLoading />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
