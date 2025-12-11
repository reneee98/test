import type { Metadata } from "next";
import Script from "next/script";
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
        <Script
          id="remove-nextjs-portal"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function removeNextJSPortal() {
                  const portal = document.querySelector('nextjs-portal');
                  if (portal) {
                    portal.remove();
                  }
                }
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', removeNextJSPortal);
                } else {
                  removeNextJSPortal();
                }
                const observer = new MutationObserver(removeNextJSPortal);
                observer.observe(document.body, { childList: true, subtree: true });
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}
