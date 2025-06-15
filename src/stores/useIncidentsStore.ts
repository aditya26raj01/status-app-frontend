import { create } from "zustand";

export type IncidentUpdate = {
  message?: string;
  created_by?: string;
  created_at?: string;
};

export type AffectedService = {
  service_id: string;
  status: string;
};

export type Incident = {
  _id?: string;
  title?: string;
  description?: string;
  status?: string;
  severity?: string;
  affected_services?: AffectedService[];
  org_id?: string;
  started_at?: string;
  resolved_at?: string;
  updates?: IncidentUpdate[];
  created_at?: string;
};

type IncidentsStore = {
  incidents: Incident[] | null;
  loading: boolean;
  setIncidents: (incidents: Incident[]) => void;
  clearIncidents: () => void;
};

export const useIncidentsStore = create<IncidentsStore>((set) => ({
  incidents: null,
  loading: true,
  setIncidents: (incidents) => set({ incidents, loading: false }),
  clearIncidents: () => set({ incidents: null, loading: false }),
}));
