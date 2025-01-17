import SessionWrapper from './components/SessionWrapper';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Wrap all components with the Session Provider */}
        <SessionWrapper>{children}</SessionWrapper>
      </body>
    </html>
  );
}
