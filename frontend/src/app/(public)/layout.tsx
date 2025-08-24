import "../globals.css";
import { Toaster } from "@/components/ui/toaster";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <head>
        <title>CoinWise</title>
        <meta
          name="description"
          content="Smart budget management for students."
        />
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
