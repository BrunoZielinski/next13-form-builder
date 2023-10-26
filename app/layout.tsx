import './globals.css'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import NextTopLoader from 'nextjs-toploader'
import { ClerkProvider } from '@clerk/nextjs'

import { Toaster } from '@/components/ui/toaster'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { DesignerContextProvider } from '@/contexts/designer-context'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Form Builder',
  description: 'Form Builder built with Next.js and Clerk',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <NextTopLoader showSpinner={false} />
          <DesignerContextProvider>
            <ThemeProvider
              enableSystem
              attribute="class"
              defaultTheme="dark"
              disableTransitionOnChange
            >
              {children}
              <Toaster />
            </ThemeProvider>
          </DesignerContextProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
