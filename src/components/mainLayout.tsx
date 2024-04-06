'use client'

import React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { CirclePlus } from 'lucide-react'

import { GoogleAccount } from '@/app/(auth)/google/_auth/types'
import { TempAccount } from '@/app/(auth)/temp/_auth/types'

import { ThemeToggle } from './ui/themeToggle'

type Props = {
  googleSession: GoogleAccount[] | null
  tempSession: TempAccount[] | null
}
export const MainLayout = ({ googleSession, tempSession }: Props) => {
  const path = useParams()
  const mail = decodeURIComponent(path?.email as string)
  const limit = (googleSession?.length || 0) + (tempSession?.length || 0) === 6

  return (
    <nav className="nav_bar_container nav_color dark:nav_color_dark ">
      <div className="z-100 flex w-full justify-evenly">
        {googleSession?.map((email, i) => (
          <Link
            className={`${mail == email.email ? 'nav_icon_active' : 'nav_icon'}`}
            href={`/google/${email.email}`}
            key={email.providerAccountId}
          >
            <img className="h-10 w-10 rounded-full" src={email.picture} alt="" />
          </Link>
        ))}
        {tempSession?.map((email, i) => (
          <Link
            className={`${mail == email.email ? 'nav_icon_active' : 'nav_icon'}`}
            href={`/temp/${email.email}`}
            key={email.email}
          >
            <img className="h-10 w-10 rounded-full" src="/Logo/MailTm_Logo.webp" alt="" />
          </Link>
        ))}

        {!limit && (
          <Link href="/">
            <CirclePlus className="h-10 w-10"></CirclePlus>
          </Link>
        )}
        <ThemeToggle />
      </div>
    </nav>
  )
}
