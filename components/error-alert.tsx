import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

export interface Props {
  title: string;
  code: number;
  description?: string;
}

export default function ErrorAlert({ title, code, description }: Props) {
  return (
    <div className="pb-2">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{`code: ${code}${` ${description ?? ""}`}`}</AlertDescription>
      </Alert>
    </div>
  );
}
