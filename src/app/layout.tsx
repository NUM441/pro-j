import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import ContactChatWidget from "@/components/ContactChatWidget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nakhon Sawan Food Guide",
  description:
    "คู่มือร้านอาหารนครสวรรค์ สำหรับนักท่องเที่ยว คนในพื้นที่ และนักเดินทางที่แวะผ่าน",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="th"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        {children}
        <ContactChatWidget />
      </body>
    </html>
  );
}
