import "./globals.css";
import type { Metadata } from "next";
import { Nav } from "@/components/nav";

export const metadata: Metadata = {
  title: "Çimko İK Platformu",
  description: "Mavi Yaka İşe Alım, Yetkinlik ve Performans Platformu",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="tr"><body><Nav />{children}</body></html>;
}
