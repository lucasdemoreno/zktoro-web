import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import { WagmiProvider } from "@/providers/WagmiProvider/WagmiProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "zkToro",
  description: "zkToro UI for Chainlink hackathon",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Theme appearance="dark" accentColor="cyan" radius="large">
          <WagmiProvider>{children}</WagmiProvider>
        </Theme>
      </body>
    </html>
  );
}
