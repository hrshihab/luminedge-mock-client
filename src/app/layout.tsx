"use client"; // Add this line to indicate the component is client-side

import { Toaster } from "react-hot-toast";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <body>
        <div className="min-h-screen w-[100%] mx-auto">{children}</div>
        <Toaster />
      </body>
    </html>
  );
}
