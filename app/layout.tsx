
import type { Metadata } from "next";
import "./globals.css";
import "../public/tailwind.css";


export const metadata: Metadata = {
  title: "Pixie — AI Design Studio",
  description: "Turn ideas into polished UI in seconds. Powered by Groq, Mistral, NVIDIA & OpenRouter.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
