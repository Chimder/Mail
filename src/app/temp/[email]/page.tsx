import React, { Suspense } from 'react'

import TempMail from '@/components/TempMail'
import { getTempSession } from '@/app/(auth)/temp/_auth/options'

export default async function Email({ params }: { params: { email: string } }) {
  // const session = await getGmailSession()
  const mail = decodeURIComponent(params?.email)
  const session = await getTempSession()
  // console.log('TEMPSES', session?.accounts)
  const tempAccount = session?.accounts.find(acc => acc.email === mail)

  if (!tempAccount) {
    return <>gmail Not Found</>
  }

  return <section className="">{tempAccount && <TempMail accountData={tempAccount} />}</section>
}
