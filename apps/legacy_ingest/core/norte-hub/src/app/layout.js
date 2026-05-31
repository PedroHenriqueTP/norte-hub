
export const metadata = {
  title: 'EH A NORTE | URBAN HUB',
  description: 'Hub de direcionamento, blog e norte-store.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body>{children}</body>
    </html>
  );
}
