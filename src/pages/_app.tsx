import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AuthProvider } from "@/context/auth.context";
import AuthGuard from "@/provider/authguard.provider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <AuthGuard>
        <Component {...pageProps} />
      </AuthGuard>
    </AuthProvider>
  );
}
