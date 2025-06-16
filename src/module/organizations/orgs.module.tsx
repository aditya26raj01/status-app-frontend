import React, { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Building, Plus } from "lucide-react";
import CreateOrgDialog from "./components/create-org-dialog";
import { useOrgStore } from "@/stores/useOrgStore";
import Link from "next/link";

export default function CreateOrgPage() {
  const [openCreateOrgDialog, setOpenCreateOrgDialog] = useState(false);
  const { orgs } = useOrgStore();
  return (
    <>
      <h1 className="text-2xl font-bold">Create or Join an Organization</h1>
      <Separator className="mt-2 mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card
          className="cursor-pointer"
          onClick={() => setOpenCreateOrgDialog(true)}
        >
          <CardContent className="text-center flex flex-col items-center justify-center h-full">
            <CardTitle className="flex items-center justify-center mb-2">
              <Plus />
            </CardTitle>
            Create Organization
          </CardContent>
        </Card>
        {orgs?.map((org) => (
          <Link href={`/orgs/${org.org_slug}/incidents`} key={org._id}>
            <Card className="cursor-pointer">
              <CardContent className="text-center">
                <CardTitle className="flex items-center justify-center mb-2">
                  <Building />
                </CardTitle>
                <p className="text-sm text-gray-500">{org.name}</p>
                <p className="text-sm text-gray-500">{org.domain}</p>
                <p className="text-sm text-gray-500">
                  Created by: {org.created_by_username}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <CreateOrgDialog
        open={openCreateOrgDialog}
        setOpen={setOpenCreateOrgDialog}
      />
    </>
  );
}
