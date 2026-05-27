import type { Metadata } from "next";
import "./globals.css";
import Providers from "./Providers";

export const metadata: Metadata = {
  title: "Kajiado Directory — Virtual Stroll",
  description:
    "Explore towns and merchants across Kajiado County, Kenya on an interactive satellite map.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-savanna antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
