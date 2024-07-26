import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Slowpoke",
  description: "The group messaging app designed to be used as little as possible",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
