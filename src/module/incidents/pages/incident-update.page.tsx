import React, { useState } from "react";
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
import { CircleCheck, Plus, X } from "lucide-react";
import { sampleIncident } from "../incidents.module";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import AddUpdates from "../components/add-update";

export default function IncidentUpdatePage() {
  const incident = sampleIncident;
  const [isAddUpdateOpen, setIsAddUpdateOpen] = useState(false);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div>
          <h1 className="text-2xl font-bold mb-2">{incident.title}</h1>
          <div className="flex items-center">
            <Badge variant="default" className="text-xs mr-2 rounded-[4px]">
              {incident.status}
            </Badge>
            <span>{incident.created_at}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Label>Impact</Label>
          <Select>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select Impact" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="NONE">None</SelectItem>
                <SelectItem value="MINOR">Minor</SelectItem>
                <SelectItem value="MAJOR">Major</SelectItem>
                <SelectItem value="CRITICAL">Critical</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Separator className="mb-4" />
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-4">Update History</h2>
        <div className="flex flex-col gap-3">
          {isAddUpdateOpen && (
            <AddUpdates
              setIsAddUpdateOpen={setIsAddUpdateOpen}
              isAddUpdateOpen={isAddUpdateOpen}
            />
          )}
          {!isAddUpdateOpen && (
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() => setIsAddUpdateOpen(!isAddUpdateOpen)}
            >
              {isAddUpdateOpen ? <X /> : <Plus />}
              {isAddUpdateOpen ? "Close" : "Add Update"}
            </Button>
          )}
          {incident.updates.map((update, index) => (
            <Card key={index} className="cursor-pointer">
              <CardHeader>
                <CardTitle>{update.title}</CardTitle>
                <CardDescription>
                  <Badge
                    variant="default"
                    className="text-xs mr-2 rounded-[4px]"
                  >
                    {update.status}
                  </Badge>
                  {update.created_at}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
      <Separator className="my-4" />
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-4">Components Affected</h2>
        <div className="flex flex-col gap-2">
          {incident.components_affected.map((service, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-1 text-sm"
            >
              <h4 className="text-sm font-medium">{service.title}</h4>
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
  );
}
