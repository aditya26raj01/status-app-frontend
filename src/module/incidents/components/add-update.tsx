import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Plus, Save } from "lucide-react";

export default function AddUpdates({
  setIsAddUpdateOpen,
  isAddUpdateOpen,
  fromCreate,
}: {
  setIsAddUpdateOpen: (isAddUpdateOpen: boolean) => void;
  isAddUpdateOpen: boolean;
  fromCreate?: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {fromCreate ? "Add Current Update" : "Add Update"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div style={{ display: "flex", gap: "1rem" }}>
          <div className="flex-1">
            <label htmlFor="title">Title</label>
            <Input id="title" placeholder="Enter title" />
          </div>
          <div>
            <label htmlFor="status">Status</label>
            <Select>
              <SelectTrigger className="w-[210px]">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="INVESTIGATING">Investigating</SelectItem>
                  <SelectItem value="IDENTIFIED">Identified</SelectItem>
                  <SelectItem value="MONITORING">Monitoring</SelectItem>
                  <SelectItem value="RESOLVED">Resolved</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
      {!fromCreate && (
        <CardFooter>
          <CardAction className="w-full flex justify-end gap-2">
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() => setIsAddUpdateOpen(!isAddUpdateOpen)}
            >
              {isAddUpdateOpen ? <X /> : <Plus />}
              {isAddUpdateOpen ? "Close" : "Add Update"}
            </Button>
            <Button variant="default" className="cursor-pointer">
              <Save />
              Save
            </Button>
          </CardAction>
        </CardFooter>
      )}
    </Card>
  );
}
