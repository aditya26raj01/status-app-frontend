import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type IncidentStatusSelectorProps = {
  status: string;
  setStatus: (status: string) => void;
};

export default function IncidentStatusSelector({
  status,
  setStatus,
}: IncidentStatusSelectorProps) {
  return (
    <Select value={status} onValueChange={setStatus}>
      <SelectTrigger className="w-[210px]">
        <SelectValue placeholder="Select Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="investigating">Investigating</SelectItem>
          <SelectItem value="identified">Identified</SelectItem>
          <SelectItem value="monitoring">Monitoring</SelectItem>
          <SelectItem value="resolved">Resolved</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
