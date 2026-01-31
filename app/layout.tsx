import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
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
            <body>
                <ClerkProvider>{children}</ClerkProvider>
            </body>
        </html>
    )
}
