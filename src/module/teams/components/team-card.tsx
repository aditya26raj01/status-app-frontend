import React, { useState } from "react";
import { Team } from "@/stores/useTeamStore";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TeamCardProps {
  team: Team;
  index: number;
}

export default function TeamCard({ team, index }: TeamCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border rounded-md p-4">
      <div className="flex items-center gap-4">
        <p className="text-md font-bold text-muted-foreground pl-1">
          {index + 1}.
        </p>
        <div className="flex items-center justify-between w-full">
          <div>
            <h2 className="text-lg font-bold">{team.name}</h2>
            <p className="text-sm text-muted-foreground">
              Members: {team.members.length}
            </p>
          </div>
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => setOpen(true)}
          >
            View Members
          </Button>
        </div>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[95%] md:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Team Members</DialogTitle>
            <DialogDescription>
              List of all team members with their details.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            {team.members.map((member, index) => (
              <div key={member.user_id} className="flex items-center gap-2">
                <p className="text-sm font-medium">
                  {index + 1}. {member.user_name} - {member.user_email}
                </p>
              </div>
            ))}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
