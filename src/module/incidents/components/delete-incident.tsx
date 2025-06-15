import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { fetchClient } from "@/fetch-client";
import { Incident, useIncidentsStore } from "@/stores/useIncidentsStore";
import { Service, useServiceStore } from "@/stores/useServiceStore";
import { Loader2, Trash } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

type DeleteIncidentProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  incident: Incident | null;
};

export default function DeleteIncident({
  open,
  setOpen,
  incident,
}: DeleteIncidentProps) {
  const { incidents, setIncidents } = useIncidentsStore();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await fetchClient(
        `/incident/delete-incident?incident_id=${incident?._id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );
      setOpen(false);
      setIncidents(incidents?.filter((i) => i._id !== incident?._id) || []);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the{" "}
            {incident?.title} incident and all its data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <Button
            onClick={handleSubmit}
            className="cursor-pointer"
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" /> : <Trash />}
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
