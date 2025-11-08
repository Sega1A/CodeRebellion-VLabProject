import LayoutClient from "./components/LayoutClient";
import Providers from "./components/Providers";
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
          <Providers>
            <LayoutClient>{children}</LayoutClient>
          </Providers>
        </div>
      </body>
    </html>
  );
}
