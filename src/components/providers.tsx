"use client";

import { Provider as ReduxProvider } from "react-redux";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { store } from "@/store/store";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <SessionProvider>
        <ReduxProvider store={store}>
          {children}
          <Toaster richColors position="top-right" />
        </ReduxProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
