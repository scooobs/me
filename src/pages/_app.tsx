import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { StateProvider } from "~/providers/StateProvider";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <StateProvider>
        <Component {...pageProps} />
      </StateProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
