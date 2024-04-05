import React from 'react'

import Gmail from '@/components/Gmail'
import { getGmailSession } from '@/app/(auth)/google/_auth/options'

export default async function Email({ params }: { params: { email: string } }) {
  const mail = decodeURIComponent(params?.email)
  const session = await getGmailSession()
  const gmailAccount = session?.find(acc => acc?.email === mail)

  if (!gmailAccount) {
    return <>gmail Not Found</>
  }

  return <section className="overflow-y-hidden">{gmailAccount && <Gmail accountData={gmailAccount} />}</section>
}
