"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import ComplianceUsers from "@/components/compliance-users";
import ComplianceProjects from "@/components/compliance-projects";
import ComplianceTables from "@/components/compliance-tables";
import { useProjectCompliance } from "@/app/hooks/useProjectCompliance";
import { useTablesCompliance } from "@/app/hooks/useTablesCompliance";
import { useUsersCompliance } from "@/app/hooks/userUsersCompliance";
import { useComplianceLogs } from "@/app/hooks/useComplianceLogs";
import { useEnableRLSQuery } from "@/app/hooks/useEnableRLS";
import { toast } from "sonner";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Slash } from "lucide-react";

export default function ComplianceOrgPage() {
  const params = useParams();
  const organizationId: string = params.org as string;

  const {
    data: usersCompliance,
    isSuccess: isUsersComplianceSuccess,
    isFetching: isUsersComplianceLoading,
    refetch: refetchUsersCompliance,
    error: userComplianceError,
  } = useUsersCompliance({ organizationId });
  const {
    data: projectCompliance,
    isSuccess: isProjectComplianceSuccess,
    isFetching: isProjectComplianceLoading,
    refetch: refetchProjectCompliance,
    error: projectComplianceError,
  } = useProjectCompliance({ organizationId });
  const {
    data: tablesCompliance,
    isSuccess: isTablesComplianceSuccess,
    isFetching: isTablesComplianceLoading,
    refetch: refetchTablesCompliance,
    error: tablesComplianceError,
  } = useTablesCompliance({ organizationId });

  const {
    data: userComplianceLogs,
    isSuccess: isUserComplianceLogsSuccess,
    isFetching: isUserComplianceLogsLoading,
    refetch: refetchUserComplianceLogs,
    error: userComplianceLogsError,
  } = useComplianceLogs({
    organizationId,
    resource: "user",
  });
  const {
    data: tableComplianceLogs,
    isSuccess: isTableComplianceLogsSuccess,
    isFetching: isTablesComplianceLogsLoading,
    refetch: refetchTablesComplianceLogs,
    error: tableComplianceLogsError,
  } = useComplianceLogs({
    organizationId,
    resource: "table",
  });
  const {
    data: projectComplianceLogs,
    isSuccess: isProjectComplianceLogsSuccess,
    isFetching: isProjectComplianceLogsLoading,
    refetch: refetchProjectComplianceLogs,
    error: projectComplianceLogsError,
  } = useComplianceLogs({
    organizationId,
    resource: "project",
  });

  const {
    mutate,
    status: enableRLSQueryStatus,
    variables: enableRLSVariables,
    error: enableRLSError,
    reset: resetEnableRLSQuery,
  } = useEnableRLSQuery();

  useEffect(() => {
    if (enableRLSQueryStatus === "success") {
      toast("Run: Enable RLS", {
        description: `The table "${enableRLSVariables.table}" was altered to use RLS (Row Level Security)`,
      });
      resetEnableRLSQuery();
      refetchTablesCompliance();
      refetchTablesComplianceLogs();
    } else if (enableRLSQueryStatus === "error") {
      toast.error("Run: Enable RLS", {
        description: String(enableRLSError),
        richColors: true,
      });
      resetEnableRLSQuery();
    }
  }, [
    enableRLSQueryStatus,
    enableRLSVariables,
    enableRLSError,
    refetchTablesCompliance,
    refetchTablesComplianceLogs,
    resetEnableRLSQuery,
  ]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-start p-10">
      <div className="flex flex-col lg:w-5xl w-full justify-start pb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Organizations</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <Slash />
            </BreadcrumbSeparator>
            <BreadcrumbItem>Compliance</BreadcrumbItem>
            <BreadcrumbSeparator>
              <Slash />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink href={`/compliance/${organizationId}`}>
                {organizationId}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-xl font-bold pt-2">Compliance Dashboard</h1>
        <p className="text-md">
          Reloading the page or reloading any data in the tables will
          automatically trigger a new compliance scan.
        </p>
      </div>
      <div className="lg:w-5xl w-full flex flex-col gap-6">
        <ComplianceUsers
          report={usersCompliance}
          logs={userComplianceLogs}
          isLoadingData={!isUsersComplianceSuccess || isUsersComplianceLoading}
          isLoadingLogs={
            !isUserComplianceLogsSuccess || isUserComplianceLogsLoading
          }
          onRefreshData={refetchUsersCompliance}
          onRefreshLogs={refetchUserComplianceLogs}
          dataError={userComplianceError}
          logError={userComplianceLogsError}
        />
        <ComplianceProjects
          report={projectCompliance}
          logs={projectComplianceLogs}
          isLoadingData={
            !isProjectComplianceSuccess || isProjectComplianceLoading
          }
          isLoadingLogs={
            !isProjectComplianceLogsSuccess || isProjectComplianceLogsLoading
          }
          onRefreshData={refetchProjectCompliance}
          onRefreshLogs={refetchProjectComplianceLogs}
          dataError={projectComplianceError}
          logError={projectComplianceLogsError}
        />
        <ComplianceTables
          report={tablesCompliance}
          logs={tableComplianceLogs}
          isLoadingData={
            !isTablesComplianceSuccess || isTablesComplianceLoading
          }
          isLoadingLogs={
            !isTableComplianceLogsSuccess || isTablesComplianceLogsLoading
          }
          dataError={tablesComplianceError}
          logError={tableComplianceLogsError}
          onRefreshData={refetchTablesCompliance}
          onRefreshLogs={refetchTablesComplianceLogs}
          onEnableRLS={(table, schema, projectId) => {
            mutate({ table, schema, projectId, org: organizationId });
          }}
        />
      </div>
    </div>
  );
}
