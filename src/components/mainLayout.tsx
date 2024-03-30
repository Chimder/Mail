import React from 'react'
import Link from 'next/link'

import { MainSession } from '@/app/(auth)/google/_auth/types'

type Props = {
  session: MainSession | null
}
export const MainLayout = ({ session }: Props) => {
  console.log('SESSS', session?.user?.accounts)
  return (
    <div className="nav_bar_container">
      <nav className="z-100 flex w-full justify-evenly">
        {session?.user?.accounts.map((email, i) => (
          <Link href={`/${email.email}`} key={email.providerAccountId}>
            <img className="h-10 w-10" src={email.picture} alt="" />
            {/* <div>{email.email}</div> */}
          </Link>
        ))}
        {/* <ThemeToggle /> */}
      </nav>
    </div>
  )
}
