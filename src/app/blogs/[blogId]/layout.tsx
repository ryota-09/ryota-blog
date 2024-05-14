import type { Metadata } from "next";
import { baseURL } from "@/config";

export const metadata: Metadata = {
  metadataBase: new URL(baseURL)
};

export default function BlogDetailLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
    </>
  );
}
