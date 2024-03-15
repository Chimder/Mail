import { Account } from '@/app/(auth)/google/_auth/types'
import React from 'react'


type Props = {}

export async function Gmail({ mail }: { mail: Account }) {
  console.log('PRos', mail)
  // const mess = await getMessages(mail.accessToken, mail.refreshToken)
  // console.log(mess)
  return <div>{mail.name}</div>
}

export default Gmail
