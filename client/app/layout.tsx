import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider"; 
import { Toaster } from 'sonner'
import CONSTANTS from "@/constants/contants";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: CONSTANTS.APP_DETAILS.name,
  description: CONSTANTS.APP_DETAILS.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children} 
          <Toaster
            position="top-right"
            richColors={true}
            closeButton={true}
            toastOptions={{
              unstyled: true,
              classNames: {
                error:
                  "bg-red-400 flex items-center rounded-md px-4 py-3 text-sm w-full mx-2",
                success:
                  "text-green-400 flex items-center rounded-md px-4 py-3 text-sm w-full mx-2",
                warning:
                  "text-yellow-400 flex items-center rounded-md px-4 py-3 text-sm w-full mx-2",
                info: "bg-blue-400 flex items-center rounded-md px-4 py-3 text-sm w-full mx-2",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
