import React from 'react'

import { getGmailSession } from '@/app/(auth)/google/_auth/options'
import Gmail from '@/components/gmail'

export default async function Email({ params }: { params: { email: string } }) {
  const session = await getGmailSession()
  const mail = decodeURIComponent(params?.email)
  const gmailAccount = session?.user.accounts.find(acc => acc.email === mail)

  if (!gmailAccount) {
    return <>gmail Not Found</>
  }

  return <section className="">{gmailAccount && <Gmail accountData={gmailAccount} />}</section>
}
