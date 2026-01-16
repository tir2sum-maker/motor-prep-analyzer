import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });

export const metadata: Metadata = {
  title: "MotorPrep Analyzer - Analiza przygotowania motorycznego",
  description: "Aplikacja do monitorowania rozwoju zawodników piłki nożnej",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <body className={`${inter.variable} ${spaceGrotesk.variable}`}>
        <div className="min-h-screen bg-background">
          <nav className="border-b bg-card">
            <div className="container mx-auto px-4 py-4">
              <h1 className="text-2xl font-bold text-primary">MotorPrep Analyzer</h1>
              <p className="text-sm text-muted-foreground">System analiz\y przygotowania motorycznego</p>
            </div>
          </nav>
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
