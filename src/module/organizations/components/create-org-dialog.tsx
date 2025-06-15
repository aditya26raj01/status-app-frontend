import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetchClient } from "@/fetch-client";
import { toast } from "sonner";
import { useOrgStore } from "@/stores/useOrgStore";

type CreateOrgDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function CreateOrgDialog({
  open,
  setOpen,
}: CreateOrgDialogProps) {
  const { setOrgs, orgs } = useOrgStore();
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [orgSlug, setOrgSlug] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (!name) throw new Error("Name is required");
      if (!domain) throw new Error("Domain is required");
      if (!orgSlug) throw new Error("Organization slug is required");
      const response = await fetchClient("/org/create-org", {
        method: "POST",
        body: JSON.stringify({ name, domain, org_slug: orgSlug }),
        headers: { "Content-Type": "application/json" },
      });
      setOrgs([...(orgs ?? []), response]);
      setOpen(false);
      setName("");
      setDomain("");
      setOrgSlug("");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Organization</DialogTitle>
            <DialogDescription>
              Create a new organization to get started.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Organization Name</Label>
              <Input
                id="name-1"
                name="name"
                placeholder="My Organization"
                disabled={loading}
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="domain-1">Organization Domain</Label>
              <Input
                id="domain-1"
                name="domain"
                placeholder="my-org.com"
                disabled={loading}
                required
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="org-slug-1">Organization Slug</Label>
              <Input
                id="org-slug-1"
                name="org-slug"
                placeholder="my-org"
                disabled={loading}
                required
                value={orgSlug}
                onChange={(e) => setOrgSlug(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={loading}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading} onClick={handleSubmit}>
              {loading ? "Creating..." : "Create Organization"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
