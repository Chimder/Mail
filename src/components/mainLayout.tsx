'use client'

import React from 'react'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import { CirclePlus } from 'lucide-react'

import { GoogleSession } from '@/app/(auth)/google/_auth/types'
import { regTempEmailAccount } from '@/app/(auth)/temp/_auth/options'
import { TempAccount } from '@/app/(auth)/temp/_auth/types'

import { Button } from './ui/button'

type Props = {
  googleSession: GoogleSession | null
  tempSession: TempAccount[] | null
}
export const MainLayout = ({ googleSession, tempSession }: Props) => {
  const path = useParams()
  const mail = decodeURIComponent(path?.email as string)
  console.log(',,,,,', tempSession)

  return (
    <nav className="nav_bar_container">
      <div className="z-100 flex w-full justify-evenly">
        {googleSession?.user?.accounts.map((email, i) => (
          <Link
            className={`${mail == email.email ? 'bg-black/30' : ''}`}
            href={`/google/${email.email}`}
            key={email.providerAccountId}
          >
            <img className="h-10 w-10 rounded-full" src={email.picture} alt="" />
          </Link>
        ))}
        {tempSession?.map((email, i) => (
          <Link
            className={`${mail == email.email ? 'bg-green-500' : ''}`}
            href={`/temp/${email.email}`}
            key={email.email}
          >
            <img className="h-10 w-10 rounded-full" src="/Logo/MailTm_Logo.webp" alt="" />
          </Link>
        ))}
        <CirclePlus className="h-10 w-10"></CirclePlus>
        {/* <ThemeToggle /> */}
        <Link href={`google/login`}>
          <Button>LOG</Button>
        </Link>
        <form action={regTempEmailAccount} className="">
          <Button>temp</Button>
        </form>
      </div>
    </nav>
  )
}
