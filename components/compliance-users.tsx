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
import { EllipsisVerticalIcon } from "lucide-react";
import { RotateCcw } from "lucide-react";
import { Button } from "./ui/button";
import { useMemo, useState } from "react";
import SkeletonTableBody from "./skeleton-table-body";
import { UserComplianceReport } from "@/app/lib/api/compliance";
import { ComplianceLog } from "@/app/hooks/useComplianceLogs";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { formatDateTimeWithYear } from "@/lib/time";
import { ApiError } from "@/app/lib/api/error";
import ErrorAlert from "./error-alert";

interface Props {
  report?: UserComplianceReport;
  logs?: ComplianceLog[];
  isLoadingData?: boolean;
  isLoadingLogs?: boolean;
  dataError: ApiError | null;
  logError: ApiError | null;
  onRefreshData: () => void;
  onRefreshLogs: () => void;
}

export default function ComplianceUsers({
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
      <TableRow key={item.user_id}>
        <TableCell className="font-medium">{item.user_name}</TableCell>
        <TableCell>{item.email}</TableCell>
        <TableCell>{item.role_name}</TableCell>
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
                  <DropdownMenuItem disabled>
                    Recommendation: Reach out to them
                  </DropdownMenuItem>
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
          <TableCell>{data.email}</TableCell>
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
      title="Users"
      description="Check the compliance of your users across organizations"
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
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
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
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
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
