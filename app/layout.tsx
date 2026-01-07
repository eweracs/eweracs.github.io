import '../styles/globals.css'

export const metadata = {
  title: 'Sebastian Carewe',
  description: 'Font development',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}