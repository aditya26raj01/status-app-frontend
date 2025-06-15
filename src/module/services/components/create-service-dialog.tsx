import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetchClient } from "@/fetch-client";
import { toast } from "sonner";
import { useOrgStore } from "@/stores/useOrgStore";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useServiceStore } from "@/stores/useServiceStore";

type CreateServiceDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function CreateServiceDialog({
  open,
  setOpen,
}: CreateServiceDialogProps) {
  const { operatingOrg } = useOrgStore();
  const { services, setServices } = useServiceStore();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("unknown");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (!name) throw new Error("Name is required");
      if (!description) throw new Error("Description is required");
      if (!status) throw new Error("Status is required");
      const response = await fetchClient("/service/create-service", {
        method: "POST",
        body: JSON.stringify({
          name,
          description,
          status,
          org_id: operatingOrg?._id,
        }),
        headers: { "Content-Type": "application/json" },
      });
      setServices([...(services ?? []), response]);
      setOpen(false);
      setName("");
      setDescription("");
      setStatus("unknown");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Service</DialogTitle>
            <DialogDescription>Create a new service.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Service Name</Label>
              <Input
                id="name-1"
                name="name"
                placeholder="My Service"
                disabled={loading}
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="description-1">Service Description</Label>
              <Textarea
                id="description-1"
                name="description"
                placeholder="My Service Description"
                disabled={loading}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="status-1">Service status</Label>
              <Select
                name="status"
                value={status}
                onValueChange={setStatus}
                disabled={loading}
              >
                <SelectTrigger className="w-full" id="status-1">
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
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={loading}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading} onClick={handleSubmit}>
              {loading ? "Creating..." : "Create Service"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
