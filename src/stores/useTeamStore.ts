import { create } from "zustand";
import { User } from "./useUserStore";

export type TeamMember = {
  user_id: string;
  user_name: string;
  user_email: string;
  role: string;
  created_by?: string;
};

export type Team = {
  name: string;
  org_id: string;
  members: TeamMember[];
};

type TeamStore = {
  teams: Team[] | null;
  loading: boolean;
  orgMembers: User[] | null;
  setTeams: (teams: Team[]) => void;
  setOrgMembers: (members: User[]) => void;
  clearTeams: () => void;
};

export const useTeamStore = create<TeamStore>((set) => ({
  teams: null,
  loading: true,
  orgMembers: null,
  setTeams: (teams) => set({ teams, loading: false }),
  setOrgMembers: (members) => set({ orgMembers: members }),
  clearTeams: () => set({ teams: null, loading: false }),
}));
