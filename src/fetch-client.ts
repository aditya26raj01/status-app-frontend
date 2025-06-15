import { auth } from "@/lib/firebase";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchClient = async (url: string, options: RequestInit = {}) => {
  const token = await auth.currentUser?.getIdToken();
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };
  const response = await fetch(`${API_URL}${url}`, { ...options, headers });
  if (!response.ok) {
    const error = await response.json();
    if (Array.isArray(error.detail)) {
      throw new Error(error.detail[0].msg);
    }
    throw new Error(error.detail);
  }
  return response.json();
};
