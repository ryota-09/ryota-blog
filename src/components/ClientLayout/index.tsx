"use client"
import type { ReactNode } from "react";

type ClientLayoutProps = {
  children: ReactNode;
}

// Cloudflare Web Analyticsはドメインプロキシ時にダッシュボードから自動挿入される
const ClientLayout = ({ children }: ClientLayoutProps) => {
  return <>{children}</>
}
export default ClientLayout;