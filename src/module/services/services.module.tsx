import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import CreateServiceDialog from "./components/create-service-dialog";
import { useServiceStore } from "@/stores/useServiceStore";
import { fetchClient } from "@/fetch-client";
import { useOrgStore } from "@/stores/useOrgStore";
import { Badge } from "@/components/ui/badge";

export default function ServicesModule() {
  const { operatingOrg } = useOrgStore();
  const [openCreateServiceDialog, setOpenCreateServiceDialog] = useState(false);

  const { setServices, services, loading, clearServices } = useServiceStore();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetchClient(
          `/service/get-all-services?org_id=${operatingOrg?._id}`
        );
        setServices(response);
      } catch (error) {
        clearServices();
      }
    };
    if (operatingOrg?._id) {
      fetchServices();
    }
  }, [operatingOrg?._id]);

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Services</h1>
        <Button
          variant="outline"
          className="cursor-pointer"
          onClick={() => setOpenCreateServiceDialog(true)}
        >
          <Plus />
          Create Service
        </Button>
      </div>
      <Separator className="mt-2 mb-6" />
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
              <div key={service._id} className="border rounded-md p-4">
                <div className="flex items-center gap-4">
                  <p className="text-md font-bold text-muted-foreground pl-1">
                    {index + 1}.
                  </p>
                  <div className="flex items-center justify-between w-full gap-2">
                    <div>
                      <h2 className="text-lg font-bold">{service.name}</h2>
                      <p className="text-sm text-muted-foreground">
                        {service.description}
                      </p>
                    </div>
                    <Badge
                      className={`border-0 w-[100] rounded-[5] ${
                        service.status === "degraded_performance"
                          ? "bg-orange-500"
                          : service.status === "maintenance"
                          ? "bg-blue-500"
                          : service.status === "outage"
                          ? "bg-red-500"
                          : "bg-green-500"
                      }`}
                    >
                      {service.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      })()}
      <CreateServiceDialog
        open={openCreateServiceDialog}
        setOpen={setOpenCreateServiceDialog}
      />
    </>
  );
}
