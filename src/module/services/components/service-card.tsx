import React from "react";
import { Service } from "@/stores/useServiceStore";
import { Eye, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import ServiceStatus from "@/components/service-status";
import { User } from "@/stores/useUserStore";
import { Org } from "@/stores/useOrgStore";

interface ServiceCardProps {
  service: Service;
  index: number;
  setOpenServiceDialog: (open: boolean) => void;
  setServiceToUpdate: (service: Service) => void;
  setServiceToDelete: (service: Service) => void;
  setOpenDeleteServiceDialog: (open: boolean) => void;
  user: User | null;
  org: Org | null;
}

export default function ServiceCard({
  service,
  index,
  setOpenServiceDialog,
  setServiceToUpdate,
  setServiceToDelete,
  setOpenDeleteServiceDialog,
  user,
  org,
}: ServiceCardProps) {
  const isAdmin = user?.org_memberships?.some(
    (membership: { org_id: string; role: string }) =>
      membership.org_id === org?._id && membership.role === "admin"
  );

  return (
    <div key={service._id} className="border rounded-md p-4">
      <div className="flex items-center gap-4">
        <p className="text-md font-bold text-muted-foreground pl-1">
          {index + 1}.
        </p>
        <div className="flex items-center justify-between w-full gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold">{service.name}</h2>
              <ServiceStatus service={service} />
            </div>
            <p className="text-sm text-muted-foreground">
              {service.description}
            </p>
            <p className="text-sm text-muted-foreground">
              Created by: {service.created_by_username}
            </p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Button
              variant="outline"
              className="cursor-pointer w-full"
              onClick={() => {
                setOpenServiceDialog(true);
                setServiceToUpdate(service);
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
                  setOpenDeleteServiceDialog(true);
                  setServiceToDelete(service);
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
