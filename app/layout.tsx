import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
    title: 'DraykoRedirect',
    description: "Service public de redirection d'URL",
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="fr">
            <body>{children}</body>
        </html>
    )
}
