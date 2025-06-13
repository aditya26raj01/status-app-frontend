import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuth } from "../context/auth.context";
import {
  ALWAYS_PUBLIC_ROUTES,
  LOGGED_OUT_ONLY_ROUTES,
  PROTECTED_ROUTES,
} from "../lib/routes";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  const path = router.pathname;

  useEffect(() => {
    if (loading) return;

    if (ALWAYS_PUBLIC_ROUTES.includes(path)) {
      return;
    }

    if (LOGGED_OUT_ONLY_ROUTES.includes(path) && user) {
      router.replace("/dashboard"); // redirect logged-in user away from login/signup
    }

    if (PROTECTED_ROUTES.includes(path) && !user) {
      router.replace("/login"); // redirect unauthenticated user from protected routes
    }
  }, [router.pathname, user, loading]);

  if (LOGGED_OUT_ONLY_ROUTES.includes(path) && user) {
    return null;
  }

  if (PROTECTED_ROUTES.includes(path) && !user) {
    return null;
  }

  return children;
}
