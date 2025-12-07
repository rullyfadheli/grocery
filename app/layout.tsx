import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import "leaflet/dist/leaflet.css";

const inter = Inter({
  subsets: ["latin"],
});

// file: app/layout.tsx
import Providers from "../provider/Provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        {/* <Providers>{children}</Providers> */}
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "var(--color-primary)",
              color: "white",
              padding: "16px",
            },
          }}
        />
      </body>
    </html>
  );
}
