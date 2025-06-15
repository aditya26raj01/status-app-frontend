import React from "react";
import { Badge } from "./ui/badge";
import { Incident } from "@/stores/useIncidentsStore";

type IncidentStatusProps = {
  incident: Incident;
};

export default function IncidentStatus({ incident }: IncidentStatusProps) {
  return (
    <Badge
      className={`border-0 rounded-[5] ${
        incident.status === "investigating"
          ? "bg-orange-500"
          : incident.status === "identified"
          ? "bg-blue-500"
          : incident.status === "monitoring"
          ? "bg-red-500"
          : "bg-green-500"
      }`}
    >
      {incident.status}
    </Badge>
  );
}
