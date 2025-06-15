import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useUserStore } from "@/stores/useUserStore";
import { fetchClient } from "@/fetch-client";
import { useOrgStore } from "@/stores/useOrgStore";
import { useServiceStore } from "@/stores/useServiceStore";
import { useIncidentsStore } from "@/stores/useIncidentsStore";

export const ClientHydrator = () => {
  const { setUser, clearUser, user } = useUserStore((s) => s);
  const { setOrgs, clearOrgs, org } = useOrgStore();
  const { setServices, clearServices } = useServiceStore();
  const { setIncidents, clearIncidents } = useIncidentsStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          const response = await fetchClient("/user/sync-user-to-db", {
            method: "POST",
            body: JSON.stringify({
              email: user.email,
              full_name: user.displayName,
              photo_url: user.photoURL,
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

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetchClient(
          `/service/get-all-services?org_id=${org?._id}`
        );
        setServices(response);
      } catch (error) {
        clearServices();
      }
    };
    if (org?._id) {
      fetchServices();
    }
  }, [org?._id]);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const response = await fetchClient(
          `/incident/get-all-incidents?org_id=${org?._id}`
        );
        setIncidents(response);
      } catch (error) {
        clearIncidents();
      }
    };
    if (org?._id) {
      fetchIncidents();
    }
  }, [org?._id]);

  return null;
};
