import './globals.css';

export const metadata = {
  title: 'EWC Laser Calculator',
  description: 'European Wax Center Laser Hair Removal Package Calculator',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
