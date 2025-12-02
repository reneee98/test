import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "World Nuclear Exhibition 2027",
  description: "The world's leading civil nuclear exhibition. WNE connects you with the most comprehensive network of worldwide top-tier suppliers and service providers across the entire nuclear sector.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
