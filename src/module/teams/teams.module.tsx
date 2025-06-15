import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import React, { useState } from "react";

export default function TeamsModule() {
  const [openTeamDialog, setOpenTeamDialog] = useState(false);
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Services</h1>
        <Button
          variant="outline"
          className="cursor-pointer"
          onClick={() => setOpenTeamDialog(true)}
        >
          <Plus />
          Create Service
        </Button>
      </div>
      <Separator className="mt-4 mb-4" />
    </>
  );
}
