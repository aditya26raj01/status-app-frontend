import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type ServiceStatusSelectorProps = {
  status: string;
  setStatus: (status: string) => void;
};

export default function ServiceStatusSelector({
  status,
  setStatus,
}: ServiceStatusSelectorProps) {
  return (
    <Select value={status} onValueChange={setStatus}>
      <SelectTrigger className="w-[210px]">
        <SelectValue placeholder="Select Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="unknown">Unknown</SelectItem>
          <SelectItem value="operational">Operational</SelectItem>
          <SelectItem value="degraded_performance">
            Degraded Performance
          </SelectItem>
          <SelectItem value="maintenance">Maintenance</SelectItem>
          <SelectItem value="outage">Outage</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
