import ComplianceCard from "./compliance-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { EllipsisVerticalIcon, RotateCcw } from "lucide-react";
import { Button } from "./ui/button";
import { useMemo, useState } from "react";
import SkeletonTableBody from "./skeleton-table-body";
import { TableComplianceReport } from "@/app/lib/api/compliance";
import { ComplianceLog } from "@/app/hooks/useComplianceLogs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { formatDateTimeWithYear } from "@/lib/time";
import { ApiError } from "@/app/lib/api/error";
import ErrorAlert from "./error-alert";

interface Props {
  report?: TableComplianceReport;
  logs?: ComplianceLog[];
  isLoadingData?: boolean;
  isLoadingLogs?: boolean;
  disableActions?: boolean;
  dataError: ApiError | null;
  logError: ApiError | null;
  onRefreshData: () => void;
  onRefreshLogs: () => void;
  onEnableRLS: (table: string, schema: string, projectId: string) => void;
}

export default function ComplianceTables({
  report,
  logs,
  isLoadingData,
  isLoadingLogs,
  disableActions,
  dataError,
  logError,
  onRefreshData,
  onRefreshLogs,
  onEnableRLS,
}: Props) {
  const [tab, setTab] = useState("overview");

  const dataRows = useMemo(() => {
    return report?.lineItems.map(({ item, breached }) => (
      <TableRow key={item.table_name + item.project_id}>
        <TableCell className="font-medium">{item.table_name}</TableCell>
        <TableCell>{item.project_id}</TableCell>
        <TableCell>{item.schema_name}</TableCell>
        <TableCell className="font-medium">
          {breached && breached.length > 0 ? (
            <Badge variant={"destructive"}>{breached[0].description}</Badge>
          ) : (
            <Badge variant={"outline"}>Passing</Badge>
          )}
        </TableCell>
        <TableCell>
          {breached && breached.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="w-full flex justify-center">
                  <Button type="button" variant="ghost" size={"icon"}>
                    <EllipsisVerticalIcon />
                  </Button>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    disabled={disableActions === true}
                    onClick={() =>
                      onEnableRLS(
                        item.table_name,
                        item.schema_name,
                        item.project_id
                      )
                    }
                  >
                    Run: Enable RLS
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </TableCell>
      </TableRow>
    ));
  }, [report, disableActions, onEnableRLS]);

  const logsRows = useMemo(() => {
    return logs?.map((log) => {
      const data = JSON.parse(log.current);
      return (
        <TableRow key={log.id}>
          <TableCell className="font-medium">{log.id}</TableCell>
          <TableCell>{data.name}</TableCell>
          <TableCell>{log.description}</TableCell>
          <TableCell>{formatDateTimeWithYear(log.createdAt)}</TableCell>
        </TableRow>
      );
    });
  }, [logs]);

  const loadingRows = <SkeletonTableBody columns={5} rows={5} />;
  const overviewRows = isLoadingData ? loadingRows : dataRows;
  const logRows = isLoadingLogs ? loadingRows : logsRows;

  return (
    <ComplianceCard
      title="Tables"
      description="Check the compliance of your database table settings"
    >
      <>
        {dataError && (
          <ErrorAlert
            title={dataError.message}
            code={dataError.code}
            description={dataError.description}
          />
        )}
        {logError && (
          <ErrorAlert
            title={logError.message}
            code={logError.code}
            description={logError.description}
          />
        )}
      </>
      <Tabs defaultValue="overview" value={tab} onValueChange={setTab}>
        <div className="inline-flex justify-between">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="logs">Compliance Logs</TabsTrigger>
          </TabsList>
          <Button
            className="ml-4"
            variant={"outline"}
            onClick={() => {
              if (tab === "overview") {
                onRefreshData();
              }
              onRefreshLogs();
            }}
          >
            <RotateCcw />
          </Button>
        </div>
        <TabsContent value="overview">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Table Name</TableHead>
                <TableHead>Project ID</TableHead>
                <TableHead>Schema Name</TableHead>
                <TableHead>Compliance Status</TableHead>
                <TableHead className="w-[50px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>{overviewRows}</TableBody>
          </Table>
        </TabsContent>
        <TabsContent value="logs">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Table Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>{logRows}</TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </ComplianceCard>
  );
}
