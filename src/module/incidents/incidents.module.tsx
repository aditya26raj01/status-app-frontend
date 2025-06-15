import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardAction,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CircleCheck, Plus } from "lucide-react";
import Link from "next/link";

export interface Service {
  title: string;
  description: string;
  status: string;
  created_at: string;
  created_by: string;
}

export interface IncidentUpdate {
  title: string;
  status: string;
  created_at: string;
  created_by: string;
}

// Sample data for IncidentUpdate
export const sampleUpdate1: IncidentUpdate = {
  title: "Initial Report",
  status: "investigating",
  created_at: "2023-10-02T09:00:00Z",
  created_by: "reporter@example.com",
};

export const sampleUpdate2: IncidentUpdate = {
  title: "Issue Identified",
  status: "identified",
  created_at: "2023-10-02T10:00:00Z",
  created_by: "engineer@example.com",
};

export const sampleUpdate3: IncidentUpdate = {
  title: "Resolved",
  status: "resolved",
  created_at: "2023-10-02T11:00:00Z",
  created_by: "admin@example.com",
};

export interface Incident {
  title: string;
  status: string;
  impact: string;
  description: string;
  components_affected: Service[];
  created_at: string;
  created_by: string;
  updates: IncidentUpdate[];
}

// Sample data for Service
export const sampleService1: Service = {
  title: "Authentication Service",
  description: "Handles user authentication and authorization.",
  status: "operational",
  created_at: "2023-10-01T10:00:00Z",
  created_by: "admin@example.com",
};

export const sampleService2: Service = {
  title: "Payment Gateway",
  description: "Processes all payment transactions.",
  status: "degraded",
  created_at: "2023-10-01T11:00:00Z",
  created_by: "finance@example.com",
};

// Sample data for Incident
export const sampleIncident: Incident = {
  title: "Database Outage",
  status: "resolved",
  impact: "high",
  description: "The main database was down for 2 hours.",
  components_affected: [sampleService1, sampleService2],
  created_at: "2023-10-02T08:30:00Z",
  created_by: "support@example.com",
  updates: [sampleUpdate1, sampleUpdate2, sampleUpdate3],
};

export default function IncidentsModule() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Incidents</h1>
        <Link href="/incidents/create">
          <Button variant="outline" className="cursor-pointer">
            <Plus />
            Create Incident
          </Button>
        </Link>
      </div>
      <Separator className="mt-2 mb-6" />
      <Link href="/incidents/1">
        <Card className="cursor-pointer">
          <CardHeader>
            <CardTitle>{sampleIncident.title}</CardTitle>
            <CardDescription>
              <Badge variant="default" className="text-xs mr-2 rounded-[4px]">
                {sampleIncident.status}
              </Badge>
              {sampleIncident.created_at}
            </CardDescription>
            <CardAction>
              <Button variant="outline" className="cursor-pointer">
                Update
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {sampleIncident.components_affected.map((service) => (
                <div className="flex items-center gap-1 text-sm">
                  <CircleCheck className="text-green-500" size={16} />
                  {service.title}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </Link>
    </>
  );
}
