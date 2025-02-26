import { ReactElement } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export interface ComplianceCardProps {
  title: string;
  description: string;
  children?: ReactElement | ReactElement[];
}

export default function ComplianceCard({
  title,
  description,
  children,
}: ComplianceCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
