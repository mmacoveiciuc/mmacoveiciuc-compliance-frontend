import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

export interface OrganizationCard {
  id: string;
  title: string;
  href: string;
  isLoading?: boolean;
}

export default function OrganizationCard({
  id,
  title,
  href,
  isLoading,
}: OrganizationCard) {
  return (
    <Card className="flex-row justify-between">
      <CardHeader>
        <CardTitle>
          {isLoading ? <Skeleton className="w-[150px] h-[15px]" /> : title}
        </CardTitle>
        <CardDescription>
          {isLoading ? <Skeleton className="w-[120px] h-[15px]" /> : id}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <a href={href}>
          <Button disabled={isLoading}>Launch</Button>
        </a>
      </CardContent>
    </Card>
  );
}
