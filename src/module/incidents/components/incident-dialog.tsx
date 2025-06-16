import React, { useEffect, useState } from "react";
import {
  Incident,
  IncidentUpdate,
  useIncidentsStore,
} from "@/stores/useIncidentsStore";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Service, useServiceStore } from "@/stores/useServiceStore";
import { Checkbox } from "@/components/ui/checkbox";
import ServiceStatusSelector from "@/components/service-status-selector";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { fetchClient } from "@/fetch-client";
import { useOrgStore } from "@/stores/useOrgStore";
import IncidentStatusSelector from "@/components/incident-status-selector";
import { Plus, Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useUserStore } from "@/stores/useUserStore";

type IncidentDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  incidentToUpdate: Incident | null;
};

export default function IncidentDialog({
  open,
  setOpen,
  incidentToUpdate,
}: IncidentDialogProps) {
  const { user } = useUserStore();
  const { org } = useOrgStore();
  const { services, setServices } = useServiceStore();
  const { incidents, setIncidents } = useIncidentsStore();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("investigating");
  const [severity, setSeverity] = useState("minor");
  const [servicesAffected, setServicesAffected] = useState<Service[]>([]);
  const [startedAt, setStartedAt] = useState(new Date().toISOString());
  const [resolvedAt, setResolvedAt] = useState(new Date().toISOString());
  const [updates, setUpdates] = useState<IncidentUpdate[]>([]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (!name) throw new Error("Name is required");
      if (!description) throw new Error("Description is required");
      if (!status) throw new Error("Status is required");
      if (!startedAt) throw new Error("Started at is required");
      const response = incidentToUpdate
        ? await fetchClient("/incident/update-incident", {
            method: "POST",
            body: JSON.stringify({
              incident_id: incidentToUpdate?._id,
              title: name,
              description,
              status,
              severity,
              affected_services: servicesAffected.map((service) => ({
                service_id: service._id,
                status: service.status,
                created_at: service.created_at,
                service_name: service.name,
              })),
              started_at: startedAt,
              resolved_at: resolvedAt,
              org_id: org?._id,
              updates: updates.map((update) => ({
                message: update.message,
                created_at: update.created_at,
                created_by: update.created_by || user?._id,
                created_by_username:
                  update.created_by_username || user?.full_name,
              })),
            }),
            headers: { "Content-Type": "application/json" },
          })
        : await fetchClient("/incident/create-incident", {
            method: "POST",
            body: JSON.stringify({
              title: name,
              description,
              status,
              severity,
              affected_services: servicesAffected.map((service) => ({
                service_id: service._id,
                status: service.status,
                service_name: service.name,
              })),
              started_at: startedAt,
              resolved_at: resolvedAt,
              org_id: org?._id,
              updates: updates.map((update) => ({ message: update.message })),
            }),
            headers: { "Content-Type": "application/json" },
          });

      setServices(
        services?.map((service) =>
          servicesAffected?.some(
            (affectedService) => affectedService._id === service._id
          )
            ? {
                ...service,
                status:
                  servicesAffected.find(
                    (affectedService) => affectedService._id === service._id
                  )?.status || service.status,
              }
            : service
        ) || []
      );
      if (incidentToUpdate) {
        setIncidents(
          incidents?.map((incident) =>
            incident._id === incidentToUpdate._id ? response : incident
          ) ?? []
        );
      } else {
        setIncidents([...(incidents || []), response]);
      }
      setOpen(false);
      setName("");
      setDescription("");
      setStatus("investigating");
      setSeverity("minor");
      setServicesAffected([]);
      setStartedAt(new Date().toISOString());
      setResolvedAt(new Date().toISOString());
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (incidentToUpdate) {
      setName(incidentToUpdate.title || "");
      setDescription(incidentToUpdate.description || "");
      setStatus(incidentToUpdate.status || "investigating");
      setSeverity(incidentToUpdate.severity || "minor");
      setServicesAffected(
        services?.filter((service) =>
          incidentToUpdate.affected_services?.some(
            (affectedService) => affectedService.service_id === service._id
          )
        ) || []
      );
      setStartedAt(incidentToUpdate.started_at || new Date().toISOString());
      setResolvedAt(incidentToUpdate.resolved_at || new Date().toISOString());
      setUpdates(incidentToUpdate.updates || []);
    } else {
      setName("");
      setDescription("");
      setStatus("investigating");
      setSeverity("minor");
      setServicesAffected([]);
      setStartedAt(new Date().toISOString());
      setResolvedAt(new Date().toISOString());
      setUpdates([]);
    }
  }, [incidentToUpdate]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form>
        <DialogContent className="sm:max-w-[95%] md:max-w-[600px] overflow-y-scroll max-h-[80%]">
          <DialogHeader>
            <DialogTitle>
              {incidentToUpdate ? "Update Incident" : "Create Incident"}
            </DialogTitle>
            <DialogDescription>
              {incidentToUpdate
                ? "Update the incident."
                : "Create a new incident."}
            </DialogDescription>
          </DialogHeader>
          <Separator />
          <div className="grid gap-4">
            <Label className="text-xl font-medium">Incident Details</Label>
            <div className="grid gap-3">
              <Label htmlFor="incident-title">Incident Title</Label>
              <Input
                id="incident-title"
                name="incident-title"
                placeholder="My Incident"
                disabled={loading}
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="incident-description">Incident Description</Label>
              <Textarea
                id="incident-description"
                name="incident-description"
                placeholder="My Incident Description"
                disabled={loading}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="grid gap-3">
              <div className="flex items-center gap-2">
                <Label htmlFor="incident-description">Incident Status</Label>
                <IncidentStatusSelector status={status} setStatus={setStatus} />
              </div>
            </div>
            <Separator className="my-4" />
            <div className="grid gap-3">
              <Label htmlFor="status-1" className="text-xl font-medium">
                Components Affected
              </Label>
              <div className="flex flex-col gap-2">
                {services?.map((service, index) => {
                  const isAffected = servicesAffected.some(
                    (component) => component._id === service._id
                  );
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between gap-1 text-sm"
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          id={service.name}
                          checked={isAffected}
                          onCheckedChange={(checked) => {
                            setServicesAffected(
                              checked
                                ? [...servicesAffected, service]
                                : servicesAffected.filter(
                                    (component) => component._id !== service._id
                                  )
                            );
                          }}
                        />
                        <Label htmlFor={service.name}>
                          <h4 className="text-sm font-medium">
                            {service.name}
                          </h4>
                        </Label>
                      </div>
                      {isAffected && (
                        <div className="flex items-center gap-2">
                          <ServiceStatusSelector
                            status={
                              servicesAffected.find(
                                (component) => component._id === service._id
                              )?.status || "investigating"
                            }
                            setStatus={(status) => {
                              setServicesAffected(
                                servicesAffected.map((component) =>
                                  component._id === service._id
                                    ? { ...component, status }
                                    : component
                                )
                              );
                            }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <Separator className="my-4" />
            <div className="grid gap-3 border rounded-md p-4">
              <Label className="text-xl font-medium">Incident Updates</Label>
              <Button
                variant="outline"
                className="cursor-pointer"
                onClick={() =>
                  setUpdates([
                    ...updates,
                    {
                      message: "",
                      created_at: new Date().toISOString(),
                      //   created_by: "",
                    },
                  ])
                }
              >
                <Plus />
                Add Update
              </Button>
              {updates.length === 0 && (
                <p className="text-sm text-muted-foreground text-center">
                  No updates yet. Add an update to the incident.
                </p>
              )}
              {updates.length > 0 && (
                <div className="grid gap-8 mt-4">
                  {updates
                    .slice()
                    .reverse()
                    .map((update, index) => (
                      <div className="grid gap-3" key={index}>
                        <Label
                          htmlFor={`update-${index}`}
                          className="font-bold"
                        >
                          Update {updates.length - index}
                        </Label>
                        <Textarea
                          id={`update-${index}`}
                          name={`update-${index}`}
                          placeholder="My Incident Update"
                          disabled={loading || update.created_by !== undefined}
                          required
                          value={update.message}
                          onChange={(e) =>
                            setUpdates(
                              updates.map((u, i) =>
                                i === updates.length - index - 1
                                  ? { ...u, message: e.target.value }
                                  : u
                              )
                            )
                          }
                        />
                        {update.created_by && (
                          <div className="flex flex-col gap-2 text-sm">
                            <Label htmlFor={`update-${index}`}>
                              Created at:{" "}
                              {new Date(
                                update.created_at || ""
                              ).toLocaleString()}
                            </Label>
                            <Label htmlFor={`update-${index}`}>
                              Created by: {update.created_by_username}
                            </Label>
                          </div>
                        )}
                        {update.created_by === undefined && (
                          <Button
                            variant="outline"
                            className="cursor-pointer w-full"
                            onClick={() =>
                              setUpdates(
                                updates.filter(
                                  (_, i) => i !== updates.length - index - 1
                                )
                              )
                            }
                            disabled={
                              loading || update.created_by !== undefined
                            }
                          >
                            <Trash />
                            Delete Update {updates.length - index}
                          </Button>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={loading}>
                Cancel
              </Button>
            </DialogClose>
            <Button disabled={loading} onClick={handleSubmit}>
              {incidentToUpdate
                ? loading
                  ? "Updating..."
                  : "Update Incident"
                : loading
                ? "Creating..."
                : "Create Incident"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
