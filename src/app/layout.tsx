export const metadata = {
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
      <body>{children}</body>
    </html>
  );
}
