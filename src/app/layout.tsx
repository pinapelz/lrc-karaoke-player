import type { Metadata } from "next";
import StyledComponentsRegistry from "./registry";

export const metadata: Metadata = {
  title: "LRC-Karaoke Player",
  description:
    "A karaoke oriented media player with support for lyrics, subtitles, and offset adjustments!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  );
}