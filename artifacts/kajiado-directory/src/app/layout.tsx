import type { Metadata } from "next";
import "./globals.css";
import Providers from "./Providers";

export const metadata: Metadata = {
  title: "Kajiado Mtaani",
  description: "Explore towns, merchants, jobs and shop local goods across Kajiado County, Kenya.",
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
