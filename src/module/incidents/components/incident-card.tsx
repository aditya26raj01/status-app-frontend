import React from "react";
import { Button } from "@/components/ui/button";
import { Incident } from "@/stores/useIncidentsStore";
import IncidentStatus from "@/components/incident-status";
import { Eye, Trash } from "lucide-react";
import { User } from "@/stores/useUserStore";
import { Org } from "@/stores/useOrgStore";

interface IncidentCardProps {
  incident: Incident;
  index: number;
  setOpenIncidentDialog: (open: boolean) => void;
  setIncidentToUpdate: (incident: Incident) => void;
  setIncidentToDelete: (incident: Incident) => void;
  setOpenDeleteIncidentDialog: (open: boolean) => void;
  user: User | null;
  org: Org | null;
}

export default function IncidentCard({
  incident,
  index,
  setIncidentToUpdate,
  setOpenIncidentDialog,
  setIncidentToDelete,
  setOpenDeleteIncidentDialog,
  user,
  org,
}: IncidentCardProps) {
  const isAdmin = user?.org_memberships?.some(
    (membership: { org_id: string; role: string }) =>
      membership.org_id === org?._id && membership.role === "admin"
  );

  return (
    <div key={incident._id} className="border rounded-md p-4">
      <div className="flex items-center gap-4">
        <p className="text-md font-bold text-muted-foreground pl-1">
          {index + 1}.
        </p>
        <div className="flex items-center justify-between w-full gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold">{incident.title}</h2>
              <IncidentStatus incident={incident} />
            </div>
            <p className="text-sm text-muted-foreground">
              {incident.description}
            </p>
            <p className="text-sm text-muted-foreground">
              Created by: {incident.created_by_username}
            </p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Button
              variant="outline"
              className="cursor-pointer w-full"
              onClick={() => {
                setOpenIncidentDialog(true);
                setIncidentToUpdate(incident);
              }}
            >
              <Eye />
              View
            </Button>
            {isAdmin && (
              <Button
                variant="destructive"
                className="cursor-pointer w-full"
                onClick={() => {
                  setOpenDeleteIncidentDialog(true);
                  setIncidentToDelete(incident);
                }}
              >
                <Trash />
                Delete
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
