import { create } from "zustand";

export type Org = {
  _id?: string;
  name?: string;
  domain?: string;
  org_slug?: string;
  created_at?: string;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;
};

type OrgStore = {
  org: Org | null;
  orgs: Org[] | null;
  loading: boolean;
  setOrg: (org: Org) => void;
  clearOrg: () => void;
  setOrgs: (orgs: Org[]) => void;
  clearOrgs: () => void;
};

export const useOrgStore = create<OrgStore>((set) => ({
  org: null,
  orgs: null,
  loading: true,
  setOrg: (org) => set({ org, loading: false }),
  clearOrg: () => set({ org: null, loading: false }),
  setOrgs: (orgs) => set({ orgs }),
  clearOrgs: () => set({ orgs: null }),
}));
