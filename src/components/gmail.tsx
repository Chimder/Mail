// 'use client'

import { getMessage, getMessages } from '@/app/(auth)/google/_auth/options'
import { Account } from '@/app/(auth)/google/_auth/types'

const getMessageData = message => {
  const headers = message.payload.headers

  const subjectHeader = headers.find(header => header.name === 'Subject')
  const fromHeader = headers.find(header => header.name === 'From')
  const toHeader = headers.find(header => header.name === 'To')

  const subject = subjectHeader ? subjectHeader.value : ''
  const from = fromHeader ? fromHeader.value : ''
  const to = toHeader ? toHeader.value : ''

  return { subject, from, to }
}

function decodeMessageBody(body) {
  if (!body || !body.data) {
    return ''
  }

  // Содержимое сообщения обычно закодировано в base64url
  const base64text = body.data.replace(/-/g, '+').replace(/_/g, '/')
  const decodedText = Buffer.from(base64text, 'base64').toString('utf8')

  return decodedText
}

export default async function Gmail({ mail }: { mail: Account }) {
  const messageIds = await getMessages(mail.accessToken, mail.refreshToken)
  const one = messageIds?.messages[20].id
  const oneMess = await getMessage(mail.accessToken, mail.refreshToken, one!)

  const messageData = getMessageData(oneMess)
  const decodedMessage = decodeMessageBody(oneMess.payload?.parts[1]?.body)

  console.log('Message Data:', messageData)
  console.log('Decoded Message:', decodedMessage)

  return (
    <>
      <div>Mails</div>
      <div>{mail.name}</div>
      <div dangerouslySetInnerHTML={{ __html: decodedMessage }} />
    </>
  )
}
