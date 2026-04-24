import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ArthurHost Blog",
  description: "小團隊部落格",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW" className="h-full antialiased">
      <body className={`${geist.className} min-h-full flex flex-col bg-white text-gray-900`}>
        {children}
      </body>
    </html>
  );
}
