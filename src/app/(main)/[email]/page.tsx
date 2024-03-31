import React from 'react'

import Gmail from '@/components/gmail'
import { getMessagesAndContent, getSession } from '@/app/(auth)/google/_auth/options'

export default async function Email({ params }: { params: { email: string } }) {
  const session = await getSession()
  const mail = decodeURIComponent(params?.email)
  const gmailAccount = session?.user.accounts.find(acc => acc.email === mail)

  if (!gmailAccount) {
    return <>gmail Not Found</>
  }
  const mailData = await getMessagesAndContent(
    gmailAccount?.accessToken,
    gmailAccount?.refreshToken,
  )
  console.log(mailData?.messagesData.length)

  // console.log('DATA', mailData)
  return (
    <section className="overflow-x-hidden">
      <div></div>
      {gmailAccount && <Gmail mail={mailData} />}
    </section>
  )
}
