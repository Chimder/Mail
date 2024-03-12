import React from 'react'

import { getMessages, getSession } from '@/lib/auth/actions'

type Props = {}

export async function Test(props: Props) {
  const session = await getSession()
  console.log(
    'MAINSES',
    session?.user.accounts.map(acc => acc.email),
  )
  // const mess = await getMessages('100477167703661986822')
  // console.log('MESSS', mess)
  return <div>{session?.user.accounts.map(acc => <div>{acc.email}</div>)}</div>
}
