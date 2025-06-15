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
import { Service, useServiceStore } from "@/stores/useServiceStore";
import { Loader2, Trash } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

type DeleteServiceProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  service: Service | null;
};

export default function DeleteService({
  open,
  setOpen,
  service,
}: DeleteServiceProps) {
  const { services, setServices } = useServiceStore();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await fetchClient(`/service/delete-service?service_id=${service?._id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      setOpen(false);
      setServices(services?.filter((s) => s._id !== service?._id) || []);
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
            {service?.name} service and all its data.
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
