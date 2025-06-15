import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import React from "react";
import AddUpdates from "../components/add-update";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

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

export default function IncidentCreatePage() {
  return (
    <>
      <h2 className="text-xl font-semibold">Incident Details</h2>
      <Separator className="my-4" />
      <div className="flex flex-col gap-3">
        <div className="flex-1">
          <label htmlFor="title">Incident Title</label>
          <Input id="title" placeholder="Enter title" />
        </div>
        <div className="flex-1">
          <label htmlFor="description">Incident Description</label>
          <Textarea id="description" placeholder="Enter description" />
        </div>
        <div className="flex-1 mt-2">
          <AddUpdates
            fromCreate
            setIsAddUpdateOpen={() => {}}
            isAddUpdateOpen={true}
          />
        </div>
        <Separator className="mt-4 mb-2" />
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-4">Components Affected</h2>
          <div className="flex flex-col gap-2">
            {[sampleService1, sampleService2].map((service, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-1 text-sm"
              >
                <div className="flex items-center gap-3">
                  <Checkbox id={service.title} />
                  <Label htmlFor={service.title}>
                    <h4 className="text-sm font-medium">{service.title}</h4>
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Select>
                    <SelectTrigger className="w-[210px]">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="UNKNOWN">Unknown</SelectItem>
                        <SelectItem value="OPERATIONAL">Operational</SelectItem>
                        <SelectItem value="DEGRADED_PERFORMANCE">
                          Degraded Performance
                        </SelectItem>
                        <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                        <SelectItem value="OUTAGE">Outage</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
