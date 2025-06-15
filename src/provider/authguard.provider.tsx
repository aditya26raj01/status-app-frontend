import { useRouter } from "next/router";
import { useEffect } from "react";
import { useUserStore } from "@/stores/useUserStore";
import { useOrgStore } from "@/stores/useOrgStore";
import { Button } from "@/components/ui/button";
import { fetchClient } from "@/fetch-client";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading: userLoading } = useUserStore();
  const { clearOrg, orgs, setOrg, loading: orgLoading, org } = useOrgStore();
  const router = useRouter();

  const path = router.pathname;

  useEffect(() => {
    if (path === "/status/[org]") return;

    if (userLoading) return;

    if (path === "/" && user) {
      if (user?.org_memberships?.length === 0 || !user.current_org) {
        router.replace("/orgs");
      } else {
        router.replace(`/orgs/${user?.current_org.org_slug}/incidents`);
      }
    }
    if (path !== "/" && !user) {
      router.replace("/");
    }
  }, [path, user, userLoading]);

  useEffect(() => {
    if (router.query.org && orgs && orgs.length > 0) {
      const org = orgs?.find((org) => org.org_slug === router.query.org);
      if (org) {
        setOrg(org);
        try {
          fetchClient(`/user/update-current-org?org_id=${org._id}`, {
            method: "POST",
          }).catch((error) => console.log(error));
        } catch (error) {
          clearOrg();
        }
      } else {
        clearOrg();
      }
    }
  }, [router.query.org, orgs]);

  useEffect(() => {
    if (path === "/orgs") {
      clearOrg();
    }
  }, [path]);

  if (path === "/status/[org]") {
    return children;
  }

  if (userLoading || (path !== "/" && orgLoading)) {
    return null;
  }

  if (path === "/" && user) {
    return null;
  }
  if (path !== "/" && !user) {
    return null;
  }
  if (!org && path !== "/orgs" && path !== "/") {
    return (
      <div className="flex flex-col gap-4 items-center justify-center h-screen">
        <p className="text-sm text-muted-foreground">Organizations not found</p>
        <Button
          variant="outline"
          className="cursor-pointer"
          onClick={() => router.replace("/orgs")}
        >
          Create or Join an Organization
        </Button>
      </div>
    );
  }
  return children;
}
