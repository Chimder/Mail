"use client";

import { SessionProvider } from "next-auth/react";

export const ProviderAuth = ({ children }: { children: React.ReactNode }) => {
  return <SessionProvider>{children}</SessionProvider>;
};
