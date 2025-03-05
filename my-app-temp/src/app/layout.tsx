import type { Metadata } from "next";
import "./globals.css";
import { Poppins } from "next/font/google"; 

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins", 
});

export const metadata: Metadata = {
  title: "MGIT Unofficial",
  description: "Hub for MGITians",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="antialiased font-poppins">
        {children}
      </body>
    </html>
  );
}
