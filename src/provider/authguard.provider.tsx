import { useRouter } from "next/router";
import { useEffect } from "react";
import { useUserStore } from "@/stores/useUserStore";
import { useOrgStore } from "@/stores/useOrgStore";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading: userLoading } = useUserStore();
  const { org, clearOrg } = useOrgStore();
  const router = useRouter();

  const path = router.pathname;

  useEffect(() => {
    if (userLoading) return;

    if (path === "/" && user) {
      if (user?.org_memberships?.length === 0 || !user.current_org) {
        router.replace("/orgs");
      } else {
        router.replace(`/orgs/${user?.current_org.org_slug}`);
      }
    }
  }, [path, user, userLoading]);

  useEffect(() => {
    if (org) {
      router.replace(`/orgs/${org.org_slug}`);
    }
  }, [org]);

  useEffect(() => {
    if (path === "/orgs") {
      clearOrg();
    }
  }, [path]);

  if (userLoading) {
    return null;
  }

  if (path === "/" && user) {
    return null;
  }

  return children;
}
