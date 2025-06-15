import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import ServiceDialog from "./components/service-dialog";
import { Service, useServiceStore } from "@/stores/useServiceStore";
import { fetchClient } from "@/fetch-client";
import { useOrgStore } from "@/stores/useOrgStore";
import ServiceCard from "./components/service-card";
import DeleteService from "./components/delete-service";

export default function ServicesModule() {
  const { org } = useOrgStore();
  const [openServiceDialog, setOpenServiceDialog] = useState(false);
  const [serviceToUpdate, setServiceToUpdate] = useState<Service | null>(null);
  const [openDeleteServiceDialog, setOpenDeleteServiceDialog] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);

  const { setServices, services, loading, clearServices } = useServiceStore();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetchClient(
          `/service/get-all-services?org_id=${org?._id}`
        );
        setServices(response);
      } catch (error) {
        clearServices();
      }
    };
    if (org?._id) {
      fetchServices();
    }
  }, [org?._id]);

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Services</h1>
        <Button
          variant="outline"
          className="cursor-pointer"
          onClick={() => {
            setOpenServiceDialog(true);
            setServiceToUpdate(null);
            setServiceToDelete(null);
          }}
        >
          <Plus />
          Create Service
        </Button>
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

        if (!services || services.length === 0) {
          return (
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-sm text-muted-foreground">No services found</p>
            </div>
          );
        }
        return (
          <div className="flex flex-col gap-4">
            {services.map((service, index) => (
              <ServiceCard
                key={service._id}
                service={service}
                index={index}
                setServiceToUpdate={setServiceToUpdate}
                setOpenServiceDialog={setOpenServiceDialog}
                setServiceToDelete={setServiceToDelete}
                setOpenDeleteServiceDialog={setOpenDeleteServiceDialog}
              />
            ))}
          </div>
        );
      })()}
      <ServiceDialog
        serviceToUpdate={serviceToUpdate}
        open={openServiceDialog}
        setOpen={setOpenServiceDialog}
      />
      <DeleteService
        open={openDeleteServiceDialog}
        setOpen={setOpenDeleteServiceDialog}
        service={serviceToDelete}
      />
    </>
  );
}
