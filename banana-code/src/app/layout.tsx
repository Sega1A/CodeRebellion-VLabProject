import LayoutClient from "./components/LayoutClient";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <div suppressHydrationWarning>
          <LayoutClient>{children}</LayoutClient>
        </div>
      </body>
    </html>
  );
}
