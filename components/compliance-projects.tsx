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
import { ProjectComplianceReport } from "@/app/lib/api/compliance";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ComplianceLog } from "@/app/hooks/useComplianceLogs";
import { formatDateTimeWithYear } from "@/lib/time";
import { ApiError } from "@/app/lib/api/error";
import ErrorAlert from "./error-alert";

interface Props {
  report?: ProjectComplianceReport;
  logs?: ComplianceLog[];
  isLoadingData?: boolean;
  isLoadingLogs?: boolean;
  dataError: ApiError | null;
  logError: ApiError | null;
  onRefreshData: () => void;
  onRefreshLogs: () => void;
}

export default function ComplianceProjects({
  report,
  logs,
  isLoadingData,
  isLoadingLogs,
  dataError,
  logError,
  onRefreshData,
  onRefreshLogs,
}: Props) {
  const [tab, setTab] = useState("overview");

  const dataRows = useMemo(() => {
    return report?.lineItems.map(({ item, breached }) => (
      <TableRow key={item.id}>
        <TableCell className="font-medium">{item.id}</TableCell>
        <TableCell>{item.name}</TableCell>
        <TableCell>{item.region}</TableCell>
        <TableCell className="font-medium">
          {breached && breached.length ? (
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
                  <a
                    href={`https://supabase.com/dashboard/project/${item.id}/database/backups/pitr`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <DropdownMenuItem>
                      Run: Enable PITR In Dashboard
                    </DropdownMenuItem>
                  </a>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </TableCell>
      </TableRow>
    ));
  }, [report]);

  const logsRows = useMemo(() => {
    return logs?.map((log) => {
      const data = JSON.parse(log.current);
      return (
        <TableRow key={log.id}>
          <TableCell className="font-medium">{log.id}</TableCell>
          <TableCell>{data.name}</TableCell>
          <TableCell>{data.region}</TableCell>
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
      title="Projects"
      description="Check the compliance of your project settings"
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
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Region</TableHead>
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
                <TableHead>Name</TableHead>
                <TableHead>Region</TableHead>
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
