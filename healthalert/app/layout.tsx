import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'HealthAlert Web3 — Decentralized Emergency Response',
  description: 'Blockchain-powered emergency health alert system with real-time hospital coordination',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}