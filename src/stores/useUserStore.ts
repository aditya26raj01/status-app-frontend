import { create } from "zustand";

type OrgMembership = {
  org_id: string;
  role: string;
  org_slug: string;
};

export type User = {
  _id?: string;
  email?: string;
  full_name?: string;
  photo_url?: string;
  role?: string;
  team_ids?: string[];
  org_memberships?: OrgMembership[];
  current_org?: OrgMembership;
};

type UserStore = {
  user: User | null;
  loading: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user, loading: false }),
  clearUser: () => set({ user: null, loading: false }),
}));
