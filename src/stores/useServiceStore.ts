import { create } from "zustand";

export type Service = {
  _id?: string;
  created_at?: string;
  created_by_username?: string;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;
  name?: string;
  description?: string;
  status?: string;
  org_id?: string;
};

type ServiceStore = {
  services: Service[] | null;
  loading: boolean;
  setServices: (services: Service[]) => void;
  clearServices: () => void;
};

export const useServiceStore = create<ServiceStore>((set) => ({
  services: null,
  loading: true,
  setServices: (services) => set({ services, loading: false }),
  clearServices: () => set({ services: null, loading: false }),
}));
