import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import React, { useState, useEffect } from "react";
import TeamDialog from "./components/team-dialog";
import { Team } from "@/stores/useTeamStore";
import { useOrgStore } from "@/stores/useOrgStore";
import { useTeamStore } from "@/stores/useTeamStore";
import { fetchClient } from "@/fetch-client";
import CreateUserDialog from "./components/create-user-dialog";
import TeamCard from "./components/team-card";
import { useUserStore } from "@/stores/useUserStore";

export default function TeamsModule() {
  const { org } = useOrgStore();
  const { setTeams, teams, loading, clearTeams } = useTeamStore();
  const [openTeamDialog, setOpenTeamDialog] = useState(false);
  const [teamToUpdate, setTeamToUpdate] = useState<Team | null>(null);
  const [openCreateUserDialog, setOpenCreateUserDialog] = useState(false);
  const { user } = useUserStore();

  const isAdmin = user?.org_memberships?.some(
    (membership) =>
      membership.org_id === org?._id && membership.role === "admin"
  );

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetchClient(
          `/team/get-all-teams?org_id=${org?._id}`
        );
        setTeams(response);
      } catch (error) {
        clearTeams();
      }
    };
    if (org?._id) {
      fetchTeams();
    }
  }, [org?._id]);

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Teams</h1>
        {isAdmin && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() => {
                setOpenTeamDialog(true);
                setTeamToUpdate(null);
              }}
            >
              <Plus />
              Create Team
            </Button>
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() => setOpenCreateUserDialog(true)}
            >
              <Plus />
              Create User
            </Button>
          </div>
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

        if (!teams || teams.length === 0) {
          return (
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-sm text-muted-foreground">No teams found</p>
            </div>
          );
        }
        return (
          <div className="flex flex-col gap-4">
            {teams.map((team, index) => (
              <TeamCard key={team.name} team={team} index={index} />
            ))}
          </div>
        );
      })()}
      <TeamDialog
        open={openTeamDialog}
        setOpen={setOpenTeamDialog}
        teamToUpdate={teamToUpdate}
      />
      <CreateUserDialog
        open={openCreateUserDialog}
        setOpen={setOpenCreateUserDialog}
      />
    </>
  );
}
