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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { fetchClient } from "@/fetch-client";
import { useOrgStore } from "@/stores/useOrgStore";
import { useTeamStore } from "@/stores/useTeamStore";

interface CreateUserDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function CreateUserDialog({
  open,
  setOpen,
}: CreateUserDialogProps) {
  const { setOrgMembers, orgMembers } = useTeamStore();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const { org } = useOrgStore();
  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (!email) throw new Error("Email is required");
      if (!fullName) throw new Error("Full name is required");
      const newUser = await fetchClient(
        `/user/create-user-in-org?org_id=${org?._id}`,
        {
          method: "POST",
          body: JSON.stringify({
            email,
            full_name: fullName,
          }),
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success("User created successfully");
      setOpen(false);
      setEmail("");
      setFullName("");
      setOrgMembers([...(orgMembers || []), newUser]);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create user"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form>
        <DialogContent className="sm:max-w-[95%] md:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create User</DialogTitle>
            <DialogDescription>
              Enter the details for the new user.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Input
                id="user-email"
                name="user-email"
                placeholder="Email"
                disabled={loading}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-3">
              <Input
                id="user-full-name"
                name="user-full-name"
                placeholder="Full Name"
                disabled={loading}
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={loading}>
                Cancel
              </Button>
            </DialogClose>
            <Button disabled={loading} onClick={handleSubmit}>
              {loading ? "Creating..." : "Create User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
