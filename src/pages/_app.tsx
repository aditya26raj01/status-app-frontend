import "@/styles/globals.css";
import type { AppProps } from "next/app";
import AuthGuard from "@/provider/authguard.provider";
import Layout from "@/components/layout";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { ClientHydrator } from "@/components/client-hydrator";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <ClientHydrator />
      <AuthGuard>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AuthGuard>
      <Toaster />
    </ThemeProvider>
  );
}
