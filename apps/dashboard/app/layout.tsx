import type { ReactNode } from "react";
import "@agency/react/styles.css";
export const metadata = { title: "Agency Design Platform", description: "Internal multi-brand design system dashboard" };
export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en"><body style={{ margin: 0, fontFamily: "Inter, system-ui, sans-serif" }}>{children}</body></html>;
}
