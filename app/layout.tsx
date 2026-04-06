import "./ui/global.css";
import { BackgroundVideo } from "./ui/background-video";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="relative min-h-screen bg-transparent text-white antialiased">
        <BackgroundVideo />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
