import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AIVY",
  description: "AIVY - Autonomous maintenance, from detection to contract. Fully integrable with Maximo, SAP, and Cityworks. Enhancing, not replacing, your existing infrastructure.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}

