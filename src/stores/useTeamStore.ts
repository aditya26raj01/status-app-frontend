import { create } from "zustand";

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
  setTeams: (teams: Team[]) => void;
  clearTeams: () => void;
};

export const useTeamStore = create<TeamStore>((set) => ({
  teams: null,
  loading: true,
  setTeams: (teams) => set({ teams, loading: false }),
  clearTeams: () => set({ teams: null, loading: false }),
}));
