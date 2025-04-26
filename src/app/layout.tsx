import type { Metadata } from "next";
import { Open_Sans, Outfit, Lato } from "next/font/google";
import "./globals.css";
import RainbowProvider from "./contexts/rainbowkit";

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const lato = Lato({
  subsets: ["latin"],
  variable: "--font-lato",
  weight: ["400", "700", "900"],
  // weight: ["100", "300", "400", "700", "900"],
  style: ["normal"],
  // style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "LifeSpring | Decentralized Family Building",
  description: "Web3-powered fertility solutions with smart contracts and blockchain verification",
  icons: {
    icon: '/images/logo.svg',
    apple: '/images/logo.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        /> */}
      </head>
      <body
        className={`${openSans.variable} ${outfit.variable} ${lato.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <RainbowProvider>
          {children}
        </RainbowProvider>
      </body>
    </html>
  );
}
