import React, { useEffect, useState } from "react";
import moment from "moment";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { useRouter } from "next/router";
import { fetchClient } from "@/fetch-client";
import { Service } from "@/stores/useServiceStore";
import { Incident } from "@/stores/useIncidentsStore";
import { Org } from "@/stores/useOrgStore";
import ServiceStatus from "@/components/service-status";

export default function StatusModule() {
  const router = useRouter();
  const [org, setOrg] = useState<Org>();
  const [services, setServices] = useState<Service[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await fetchClient(
          `/status/get-org-status?org_slug=${router.query.org}`
        );
        setServices(response.org_services);
        setIncidents(response.incidents);
        setOrg(response.org);
      } catch (error) {
        setServices([]);
        setIncidents([]);
      } finally {
        setLoading(false);
      }
    };

    if (router.query.org) {
      fetchServices();
    }
  }, [router.query.org]);

  useEffect(() => {
    if (!loading) {
      // Set up WebSocket connection
      const socket = new WebSocket(`ws://${process.env.NEXT_PUBLIC_WS_URL}/ws`);

      socket.onopen = () => {
        console.log("WebSocket connection established");
      };

      const updateServices = (updatedService: Service & { id: string }) => {
        const index = services?.findIndex(
          (service) => service._id === updatedService.id
        );
        if (index !== -1) {
          const newServices = [...(services || [])];
          newServices[index] = updatedService;
          setServices(newServices);
        } else {
          setServices([...(services || []), updatedService]);
        }
      };

      const updateIncidents = (updatedIncident: Incident & { id: string }) => {
        const index = incidents?.findIndex(
          (incident) => incident._id === updatedIncident.id
        );
        if (index !== -1) {
          const newIncidents = [...(incidents || [])];
          newIncidents[index] = updatedIncident;
          setIncidents(newIncidents);
        } else {
          setIncidents([...(incidents || []), updatedIncident]);
        }
      };

      const deleteService = (deletedService: Service & { id: string }) => {
        const index = services?.findIndex(
          (service) => service._id === deletedService.id
        );
        if (index !== -1) {
          const newServices = [...(services || [])];
          newServices.splice(index, 1);
          setServices(newServices);
        }
      };

      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === "service") {
          if (message.action === "delete") {
            const deletedService = JSON.parse(message.data);
            deleteService(deletedService);
          } else {
            const updatedService = JSON.parse(message.data);
            updateServices(updatedService);
          }
        }
        if (message.type === "incident") {
          const updatedIncident = JSON.parse(message.data);
          console.log(updatedIncident);
          console.log(incidents);
          updateIncidents(updatedIncident);
        }
      };

      socket.onclose = () => {
        console.log("WebSocket connection closed");
      };

      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
      return () => {
        socket.close();
      };
    }
  }, [loading]);

  const groupedEvents = incidents.reduce((acc, event) => {
    const date = moment(event.created_at).format("MMM D, YYYY");
    if (!acc[date]) acc[date] = [];
    acc[date].push(event);
    return acc;
  }, {} as Record<string, Incident[]>);

  return (
    <div className="px-4">
      <h1 className="text-3xl font-bold">{org?.name}</h1>
      <p className="text-sm text-gray-500">{org?.domain}</p>
      {(() => {
        const operationalCount = services.filter(
          (service) => service.status === "operational"
        ).length;
        const nonOperationalCount = services.length - operationalCount;
        const allOperational = operationalCount === services.length;

        return (
          <p
            className={`p-4 rounded-md mt-4 font-bold ${
              allOperational
                ? "text-green-800 bg-green-100"
                : "text-orange-800 bg-orange-100"
            }`}
          >
            {allOperational
              ? "All systems are operational"
              : `${operationalCount} systems are operational, ${nonOperationalCount} systems are not`}
          </p>
        );
      })()}
      <div className="mt-8">
        {services.map((service, index) => {
          return (
            <div
              className={`border-b border-l border-r px-4 py-3 ${
                index === 0 ? "border-t rounded-t-lg" : ""
              } ${index === services.length - 1 ? "rounded-b-lg" : ""}`}
            >
              <div className="flex justify-between items-center">
                <h2 className="font-bold">{service.name}</h2>
                <ServiceStatus service={service} />
              </div>
              {/* <div className="flex space-x-1.5 mt-2">
                {service.incidents.map((event, idx) => (
                  <div
                    key={idx}
                    className={`h-6 w-1.5 ${
                      event.status === "green"
                        ? "bg-green-500"
                        : event.status === "orange"
                        ? "bg-orange-500"
                        : "bg-red-500"
                    }`}
                  />
                ))}
              </div> */}
            </div>
          );
        })}
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold">Past Incidents</h2>
        {Object.entries(groupedEvents).map(([date, incidents]) => (
          <div key={date} className="mt-4">
            <h3 className="font-semibold text-lg border-b">{date}</h3>
            {incidents.map((event, idx) => (
              <div key={idx} className="mt-2 border-1 px-4 py-3 rounded-lg">
                <div className="flex gap-4 items-center">
                  <Badge
                    className={`border-0 w-[100] rounded-[5] ${
                      event.status === "investigating"
                        ? "bg-orange-500"
                        : event.status === "identified"
                        ? "bg-blue-500"
                        : event.status === "monitoring"
                        ? "bg-red-500"
                        : "bg-green-500"
                    }`}
                  >
                    {event.status}
                  </Badge>
                  <h4 className="font-bold text-lg border-l-2 border-gray-200 pl-3.5">
                    {event.title}
                  </h4>
                </div>
                <p className="text-sm mt-2">{event.description}</p>
                {event.updates && event.updates.length > 0 && (
                  <>
                    <p className="text-[18px] font-bold mt-4">Updates</p>
                    <Accordion type="single" collapsible className="w-full">
                      {(() => {
                        const latestUpdate =
                          event.updates[event.updates.length - 1];
                        const remainingUpdates = event.updates
                          .slice(0, event.updates.length - 1)
                          .sort((a, b) => {
                            return (
                              new Date(b.created_at || "").getTime() -
                              new Date(a.created_at || "").getTime()
                            );
                          });
                        return (
                          <AccordionItem value="item-0">
                            <AccordionTrigger className="no-underline">
                              <div className="w-full">
                                <p className="text-sm">
                                  {latestUpdate.message}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {moment(latestUpdate.created_at).format(
                                    "MMM D, HH:mm UTC"
                                  )}{" "}
                                  by {latestUpdate.created_by}
                                </p>
                              </div>
                              {remainingUpdates.length > 0 && (
                                <p className="text-sm whitespace-nowrap">
                                  {remainingUpdates.length} previous updates
                                </p>
                              )}
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="flex flex-col gap-2 pl-4">
                                {remainingUpdates.length === 0 && (
                                  <p className="text-sm">No past updates</p>
                                )}
                                {remainingUpdates.map((update, idx) => (
                                  <div key={idx}>
                                    <p className="text-sm">{update.message}</p>
                                    <p className="text-xs text-gray-500">
                                      {moment(update.created_at).format(
                                        "MMM D, HH:mm UTC"
                                      )}{" "}
                                      by {update.created_by}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        );
                      })()}
                    </Accordion>
                  </>
                )}
                {(!event.updates || event.updates.length === 0) && (
                  <p className="text-sm mt-4 mb-4">No updates yet</p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Created at:{" "}
                  {moment(event.started_at).format("MMM D, HH:mm UTC")}
                </p>
                <div className="flex flex-wrap gap-3 items-center mt-2">
                  <p className="text-[14px] font-bold text-gray-200">
                    Affected services:
                  </p>

                  {event.affected_services?.map((service, idx) => (
                    <Badge key={idx} className="bg-gray-200 text-gray-700">
                      {services.find((s) => s._id === service.service_id)?.name}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
