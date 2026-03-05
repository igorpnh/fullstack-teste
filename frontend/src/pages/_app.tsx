import type { AppProps } from "next/app";
import { useRouter } from "next/router";

import { Provider } from "../components/ui/provider";
import { AuthProvider } from "../contexts/auth-context";
import { Toaster } from "../components/ui/toaster";
import { AppLayout } from "../components/app-layout";
import { AuthGuard } from "../components/auth-guard";

const PUBLIC_ROUTES = ["/", "/login"];

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isPublicRoute = PUBLIC_ROUTES.includes(router.pathname);

  return (
    <Provider>
      <AuthProvider>
        <Toaster />
        {isPublicRoute ? (
          <Component {...pageProps} />
        ) : (
          <AuthGuard>
            <AppLayout>
              <Component {...pageProps} />
            </AppLayout>
          </AuthGuard>
        )}
      </AuthProvider>
    </Provider>
  );
}
