import './globals.css';

export const metadata = {
  title: 'Airbnb Portal',
  description: 'Internal Airbnb Management Portal',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}