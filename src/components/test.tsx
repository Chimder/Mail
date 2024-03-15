import React from 'react'
import Link from 'next/link'

import Gmail from './gmail'
import { getSession } from '@/app/(auth)/google/_auth/options'

type Props = {}

export async function Test(props: Props) {
  const session = await getSession()
  console.log(
    'MAINSES',
    session?.user.accounts.map(acc => acc.email),
  )
  // const mess = await getMessages('100477167703661986822')
  // console.log('MESSS', mess)
  return (
    <div>
      {session?.user.accounts.map(acc => (
        <Link href={`/gmail/${acc.providerAccountId}`}>
          <Gmail mail={acc} />
        </Link>
      ))}
    </div>
  )
}
