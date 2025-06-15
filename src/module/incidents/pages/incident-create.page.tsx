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
import { sampleService1, sampleService2 } from "../incidents.module";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

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
