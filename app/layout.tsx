import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import { ClientProviders } from "./ClientProviders";
import "./globals.css";

const fontSans = FontSans({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export const metadata = {
  title: "NGS Backoffice",
  description: "NGS Backoffice Assistance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen w-full bg-background font-sans antialiased",
          fontSans.className
        )}
      >
        <ClientProviders>
          <div className="flex justify-center w-full">
            <div className="w-1/2 max-w-[800px] max-md:w-[100%] max-md:max-w-[100%]">
              {children}
            </div>
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}
