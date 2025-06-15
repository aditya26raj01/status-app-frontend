import React from "react";
import { Badge } from "./ui/badge";
import { Service } from "@/stores/useServiceStore";

interface ServiceStatusProps {
  service: Service;
}

export default function ServiceStatus({ service }: ServiceStatusProps) {
  return (
    <Badge
      className={`border-0 rounded-[5] ${
        service.status === "degraded_performance"
          ? "bg-orange-500"
          : service.status === "maintenance"
          ? "bg-blue-500"
          : service.status === "outage"
          ? "bg-red-500"
          : "bg-green-500"
      }`}
    >
      {service.status}
    </Badge>
  );
}
