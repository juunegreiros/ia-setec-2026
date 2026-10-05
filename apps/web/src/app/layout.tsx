import type { Metadata } from "next";

import { QueryProviders } from "@/lib/query/providers";

import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Sistema de pedidos",
  description: "Projeto de exemplo do workshop de agentes de IA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="flex min-h-full flex-col font-sans">
        <QueryProviders>{children}</QueryProviders>
      </body>
    </html>
  );
}
