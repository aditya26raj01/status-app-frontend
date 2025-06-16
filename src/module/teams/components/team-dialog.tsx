import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2, Plus, Trash } from "lucide-react";
import { toast } from "sonner";
import { Team } from "@/stores/useTeamStore";
import { User } from "@/stores/useUserStore";
import { fetchClient } from "@/fetch-client";
import { useOrgStore } from "@/stores/useOrgStore";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useTeamStore } from "@/stores/useTeamStore";

// Define the props for the TeamDialog component
interface TeamDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  teamToUpdate: Team | null;
}

export default function TeamDialog({
  open,
  setOpen,
  teamToUpdate,
}: TeamDialogProps) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const { org } = useOrgStore();
  const [loadingUsers, setLoadingUsers] = useState(false);
  const { setTeams, teams } = useTeamStore();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        const response = await fetchClient(`/user/org/${org?._id}/users`);
        setUsers(response);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to fetch users"
        );
      } finally {
        setLoadingUsers(false);
      }
    };
    if (org?._id) {
      fetchUsers();
    }
  }, [org?._id]);

  const handleUserSelection = (user: User, isSelected: boolean) => {
    setSelectedUsers((prevSelected) =>
      isSelected
        ? [...prevSelected, user]
        : prevSelected.filter((u) => u._id !== user._id)
    );
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (!name) throw new Error("Name is required");
      const memberIds = selectedUsers.map((user) => user._id);
      const response = await fetchClient("/team/create-team", {
        method: "POST",
        body: JSON.stringify({
          name,
          org_id: org?._id,
          member_ids: memberIds,
        }),
        headers: { "Content-Type": "application/json" },
      });
      setTeams([...(teams || []), response]);
      toast.success("Team created successfully");
      setOpen(false);
      setName("");
      setSelectedUsers([]);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create team"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (teamToUpdate) {
      setName(teamToUpdate.name || "");
      setSelectedUsers(
        teamToUpdate.members.map((member) => ({
          _id: member.user_id,
          full_name: member.user_name,
          role: member.role,
        }))
      );
    } else {
      setName("");
      setSelectedUsers([]);
    }
  }, [teamToUpdate]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form>
        <DialogContent className="sm:max-w-[95%] md:max-w-[600px] overflow-y-scroll max-h-[80%]">
          <DialogHeader>
            <DialogTitle>
              {teamToUpdate ? "Update Team" : "Create Team"}
            </DialogTitle>
            <DialogDescription>
              {teamToUpdate ? "Update the team details." : "Create a new team."}
            </DialogDescription>
          </DialogHeader>
          <Separator />
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Input
                id="team-name"
                name="team-name"
                placeholder="Team Name"
                disabled={loading}
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="grid gap-3">
              <Label className="text-xl font-medium">Select Team Members</Label>
              <div className="flex flex-col gap-2">
                {loadingUsers ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                ) : (
                  users.map((user) => {
                    const isSelected = selectedUsers.some(
                      (u) => u._id === user._id
                    );
                    return (
                      <div key={user._id} className="flex items-center gap-2">
                        <Checkbox
                          id={user._id}
                          checked={isSelected}
                          onCheckedChange={(checked) =>
                            handleUserSelection(user, checked as boolean)
                          }
                        />
                        <Label htmlFor={user._id}>
                          {user.full_name} - {user.email}
                        </Label>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={loading}>
                Cancel
              </Button>
            </DialogClose>
            <Button disabled={loading} onClick={handleSubmit}>
              {teamToUpdate
                ? loading
                  ? "Updating..."
                  : "Update Team"
                : loading
                ? "Creating..."
                : "Create Team"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
