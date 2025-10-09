import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Peak and Peer",
  description: "Peak and Peer - AI-powered defect detection, asset management, contractor matching, and contract automation for Vision 2030 compliance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}

