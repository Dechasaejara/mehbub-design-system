import type { Metadata } from "next";
import "@dechasaejara/react/styles.css";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Mehubub Design System example",
  description: "A Next.js app consuming the Mehubub design system packages.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><Providers>{children}</Providers></body></html>;
}
