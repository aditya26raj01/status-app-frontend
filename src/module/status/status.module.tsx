import React from "react";
import moment from "moment";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

const services = [
  {
    name: "APIs",
    status: "operational",
    uptime: "99.82%",
    incidents: [
      {
        title: "API is down",
        description:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque quasi quia necessitatibus repudiandae minima fuga animi, nesciunt suscipit laborum illum dolore perferendis, aut officia pariatur beatae sunt, iusto sed iure?",
        status: "investigating",
        severity: "minor",
        service_ids: ["123", "456", "789"],
        started_at: "2025-06-14 10:00:00",
        updates: [
          {
            message: "We are investigating the issue",
            created_by: "John Doe",
            created_at: "2025-06-14 10:00:00",
          },
          {
            message: "Issue has been identified",
            created_by: "Jane Smith",
            created_at: "2025-06-14 11:00:00",
          },
          {
            message: "A fix is being implemented",
            created_by: "Alice Johnson",
            created_at: "2025-06-14 12:00:00",
          },
        ],
      },
    ],
  },
  {
    name: "ChatGPT",
    status: "degraded",
    uptime: "99.31%",
    incidents: [
      {
        title: "ChatGPT is down",
        description:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque quasi quia necessitatibus repudiandae minima fuga animi, nesciunt suscipit laborum illum dolore perferendis, aut officia pariatur beatae sunt, iusto sed iure?",
        status: "identified",
        severity: "major",
        service_ids: ["123", "456", "789"],
        started_at: "2025-06-14 10:00:00",
        updates: [
          //   {
          //     message: "We are investigating the issue",
          //     created_by: "John Doe",
          //     created_at: "2025-06-14 10:00:00",
          //   },
        ],
      },
    ],
  },
  {
    name: "Sora",
    status: "operational",
    uptime: "99.96%",
    incidents: [
      {
        title: "Sora is down",
        description:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque quasi quia necessitatibus repudiandae minima fuga animi, nesciunt suscipit laborum illum dolore perferendis, aut officia pariatur beatae sunt, iusto sed iure?",
        status: "monitoring",
        severity: "major",
        service_ids: ["123", "456", "789"],
        started_at: "2025-06-14 10:00:00",
        updates: [
          {
            message: "We are investigating the issue",
            created_by: "John Doe",
            created_at: "2025-06-14 10:00:00",
          },
        ],
      },
    ],
  },
  {
    name: "Playground",
    status: "degraded",
    uptime: "99.97%",
    incidents: [
      {
        title: "Playground is down",
        description:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque quasi quia necessitatibus repudiandae minima fuga animi, nesciunt suscipit laborum illum dolore perferendis, aut officia pariatur beatae sunt, iusto sed iure?",
        status: "resolved",
        severity: "major",
        service_ids: ["123", "456", "789"],
        started_at: "2025-06-14 10:00:00",
        updates: [
          {
            message: "We are investigating the issue",
            created_by: "John Doe",
            created_at: "2025-06-14 10:00:00",
          },
        ],
      },
    ],
  },
];

export default function StatusModule() {
  const pastEvents = services.flatMap((service) =>
    service.incidents
      .filter((event) =>
        moment(event.started_at).isAfter(moment().subtract(7, "days"))
      )
      .map((event) => ({ ...event, serviceName: service.name }))
  );

  const groupedEvents: Record<string, typeof pastEvents> = pastEvents.reduce(
    (acc: Record<string, typeof pastEvents>, event) => {
      const date = moment(event.started_at).format("MMM D, YYYY");
      if (!acc[date]) acc[date] = [];
      acc[date].push(event);
      return acc;
    },
    {} as Record<string, typeof pastEvents>
  );

  return (
    <>
      <div className="container mx-auto max-w-screen-lg py-20">
        <h1 className="text-3xl font-bold">Acme Inc</h1>
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
                  <h4
                    className={`text-sm ${
                      service.status === "operational"
                        ? "text-green-500"
                        : service.status === "degraded"
                        ? "text-orange-500"
                        : "text-red-500"
                    }`}
                  >
                    {service.status}
                  </h4>
                </div>
                <div className="flex space-x-1.5 mt-2">
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
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-bold">Past Incidents</h2>
          {Object.entries(groupedEvents).map(([date, incidents]) => (
            <div key={date} className="mt-4">
              <h3 className="font-semibold text-lg border-b border-gray-200">
                {date}
              </h3>
              {incidents.map((event, idx) => (
                <div
                  key={idx}
                  className="mt-2 border-1 border-gray-200 px-4 py-3 rounded-lg"
                >
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
                  {event.updates.length > 0 && (
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
                                new Date(b.created_at).getTime() -
                                new Date(a.created_at).getTime()
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
                                      <p className="text-sm">
                                        {update.message}
                                      </p>
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
                  {!event.updates.length && (
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

                    {event.service_ids.map((id, idx) => (
                      <Badge key={idx} className="bg-gray-200 text-gray-700">
                        {id}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
