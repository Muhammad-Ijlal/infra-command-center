import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Peak&Peek",
  description: "Peak&Peek - AI-powered defect detection, asset management, contractor matching, and contract automation for Vision 2030 compliance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}

