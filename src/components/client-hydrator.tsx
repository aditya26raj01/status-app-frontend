import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useUserStore } from "@/stores/useUserStore";
import { fetchClient } from "@/fetch-client";
import { useOrgStore } from "@/stores/useOrgStore";

export const ClientHydrator = () => {
  const { setUser, clearUser, user } = useUserStore((s) => s);
  const { setOrgs, clearOrgs } = useOrgStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          const response = await fetchClient("/user/sync-user-to-db", {
            method: "POST",
            body: JSON.stringify({
              email: user.email,
              full_name: user.displayName,
            }),
            headers: { "Content-Type": "application/json" },
          });
          setUser(response);
        } else {
          throw new Error("User not found");
        }
      } catch (error) {
        clearUser();
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        const response = await fetchClient(`/org/get-all-orgs`);
        setOrgs(response);
      } catch (error) {
        clearOrgs();
      }
    };
    if (user) {
      fetchOrgs();
    }
  }, [user]);

  return null;
};
