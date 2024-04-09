import "~/styles/globals.css";

import { Manrope } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { ThemeProvider } from "~/components/theme_provider";
import { Toaster } from "~/components/ui/toaster";
import Navbar from "~/components/navbar";

const main_font = Manrope({
  subsets: ["latin", "cyrillic"],
  style: "normal",
  weight: "400",
  variable: "--font-sans",
  display: "swap",
});

export const metadata = {
  title: "TradeTemple",
  description: "Лучший маркетплейс",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${main_font.variable}`}>
        <TRPCReactProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster />
            <Navbar />
            <div className="flex w-screen mt-24 min-h-[calc(100svh-6rem)] pb-4">
              {children}
            </div>
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
