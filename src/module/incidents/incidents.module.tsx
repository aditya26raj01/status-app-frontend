import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useOrgStore } from "@/stores/useOrgStore";
import { Incident, useIncidentsStore } from "@/stores/useIncidentsStore";
import { useEffect, useState } from "react";
import { fetchClient } from "@/fetch-client";
import IncidentCard from "./components/incident-card";
import IncidentDialog from "./components/incident-dialog";
import DeleteIncident from "./components/delete-incident";
import { useUserStore } from "@/stores/useUserStore";

export default function IncidentsModule() {
  const { org } = useOrgStore();
  const { setIncidents, incidents, loading, clearIncidents } =
    useIncidentsStore();
  const [openIncidentDialog, setOpenIncidentDialog] = useState(false);
  const [incidentToUpdate, setIncidentToUpdate] = useState<Incident | null>(
    null
  );
  const [openDeleteIncidentDialog, setOpenDeleteIncidentDialog] =
    useState(false);
  const [incidentToDelete, setIncidentToDelete] = useState<Incident | null>(
    null
  );

  const { user } = useUserStore();

  const isAdmin = user?.org_memberships?.some(
    (membership) =>
      membership.org_id === org?._id && membership.role === "admin"
  );

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const response = await fetchClient(
          `/incident/get-all-incidents?org_id=${org?._id}`
        );
        setIncidents(response);
      } catch (error) {
        clearIncidents();
      }
    };
    if (org?._id) {
      fetchIncidents();
    }
  }, [org?._id]);

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Incidents</h1>
        {isAdmin && (
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => {
              setOpenIncidentDialog(true);
              setIncidentToUpdate(null);
              setIncidentToDelete(null);
            }}
          >
            <Plus />
            Create Incident
          </Button>
        )}
      </div>
      <Separator className="mt-4 mb-4" />
      {(() => {
        if (loading) {
          return (
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-sm text-muted-foreground">Loading...</p>
            </div>
          );
        }

        if (!incidents || incidents.length === 0) {
          return (
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-sm text-muted-foreground">
                No incidents found
              </p>
            </div>
          );
        }
        return (
          <div className="flex flex-col gap-4">
            {incidents.map((incident, index) => (
              <IncidentCard
                key={incident._id}
                incident={incident}
                index={index}
                setIncidentToUpdate={setIncidentToUpdate}
                setOpenIncidentDialog={setOpenIncidentDialog}
                setIncidentToDelete={setIncidentToDelete}
                setOpenDeleteIncidentDialog={setOpenDeleteIncidentDialog}
                user={user}
                org={org}
              />
            ))}
          </div>
        );
      })()}
      <IncidentDialog
        incidentToUpdate={incidentToUpdate}
        open={openIncidentDialog}
        setOpen={setOpenIncidentDialog}
      />
      <DeleteIncident
        open={openDeleteIncidentDialog}
        setOpen={setOpenDeleteIncidentDialog}
        incident={incidentToDelete}
      />
    </>
  );
}
