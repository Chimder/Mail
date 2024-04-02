import React from 'react'

import Gmail from '@/components/gmail'
import { getMessagesAndContent, getSession } from '@/app/(auth)/google/_auth/options'

export default async function Email({ params }: { params: { email: string } }) {
  const session = await getSession()
  const mail = decodeURIComponent(params?.email)
  const gmailAccount = session?.user.accounts.find(acc => acc.email === mail)
  console.log('GGMAIl', gmailAccount)

  if (!gmailAccount) {
    return <>gmail Not Found</>
  }

  return <section className="">{gmailAccount && <Gmail accountData={gmailAccount} />}</section>
}
