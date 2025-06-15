import React, { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Eye } from "lucide-react";
import ServiceStatus from "@/components/service-status";
import { fetchClient } from "@/fetch-client";
import { useOrgStore } from "@/stores/useOrgStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function LogsModule() {
  const { org } = useOrgStore();
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const toggleExpand = (log: any) => {
    setSelectedLog(log);
    setOpenDialog(true);
  };

  React.useEffect(() => {
    if (selectedLog) {
      console.log(selectedLog);
    }
  }, [selectedLog]);

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        setLoading(true);
        const response = await fetchClient(
          `/log/get-logs-by-org?org_id=${org?._id}`
        );
        setLogs(response);
      } catch (error) {
        setError(error as string);
      } finally {
        setLoading(false);
      }
    };
    if (org?._id) {
      fetchIncidents();
    }
  }, [org?._id]);

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Logs</h1>
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

        if (!logs || logs.length === 0) {
          return (
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-sm text-muted-foreground">No logs found</p>
            </div>
          );
        }
        return (
          <div className="overflow-auto max-w-full">
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Entry ID</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Entity Type</TableHead>
                    <TableHead>Change Type</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <>
                      <TableRow
                        key={log._id}
                        onClick={() => toggleExpand(log)}
                        className="cursor-pointer"
                      >
                        <TableCell>{log._id}</TableCell>
                        <TableCell>{formatDate(log.created_at)}</TableCell>
                        <TableCell>{log.entity_type}</TableCell>
                        <TableCell>{log.change_type}</TableCell>
                        <TableCell>
                          <Button
                            onClick={() => toggleExpand(log)}
                            variant="default"
                            size="sm"
                          >
                            <Eye className="w-4 h-4 inline" />
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    </>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>
        );
      })()}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[95%] md:max-w-[600px] p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Log Details
            </DialogTitle>
            <DialogDescription className="mt-4 space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Entry ID:</span>
                <span>{selectedLog?._id}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Created By:</span>
                <span>{selectedLog?.created_by}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Name:</span>
                <span>{selectedLog?.changes?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Description:</span>
                <span className="max-w-xs text-right">
                  {selectedLog?.changes?.description}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Status:</span>
                <ServiceStatus
                  service={{ status: selectedLog?.changes?.status }}
                />
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
