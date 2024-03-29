import React from 'react'
import Link from 'next/link'

import Gmail from '@/components/gmail'
import { getSession } from '@/app/(auth)/google/_auth/options'

type Props = {}

export default async function Testt({ params }: { params: { email: string } }) {
  const session = await getSession()
  const mail = decodeURIComponent(params?.email)
  console.log(params.email)

  return (
    <>
      {session?.user.accounts.map(acc => (
        // <Link href={`/gmail/${acc.providerAccountId}`}>
        <Gmail mail={acc} />
        /* </Link> */
      ))}
    </>
  )
}
