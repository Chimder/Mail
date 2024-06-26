import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import '../styles/globals.css'

import { Toaster } from 'react-hot-toast'

import { MainLayout } from '@/components/mainLayout'
import { ClientProvider } from '@/components/providers/tanstack-provider'
import { ThemeProvider } from '@/components/providers/theme-provider'

import { getGmailSession } from './(auth)/google/_auth/options'
import { getTempSession } from './(auth)/temp/_auth/options'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const googleSession = await getGmailSession()
  const tempSession = await getTempSession()
  return (
    <ClientProvider>
      <html lang="en">
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <MainLayout googleSession={googleSession} tempSession={tempSession}></MainLayout>
            {/* <Toaster position="bottom-left" /> */}
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClientProvider>
  )
}
