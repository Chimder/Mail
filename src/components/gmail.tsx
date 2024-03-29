import { getMessagesAndContent } from '@/app/(auth)/google/_auth/options'
import { Account } from '@/app/(auth)/google/_auth/types'

const getMessageData = (message: any) => {
  const headers = message.value?.data?.payload?.headers

  const subjectHeader = headers.find((header: any) => header.name === 'Subject')
  const fromHeader = headers.find((header: any) => header.name === 'From')
  const toHeader = headers.find((header: any) => header.name === 'To')
  const dateHeader = headers.find((header: any) => header.name === 'Date')

  const subject = subjectHeader ? subjectHeader.value : ''
  const from = fromHeader ? fromHeader.value : ''
  const to = toHeader ? toHeader.value : ''
  const date = dateHeader ? dateHeader.value : ''
  const snippet = message.value?.data?.snippet
  const isUnread = message.value?.data?.labelIds.includes('UNREAD')

  let isBodyWithParts = false
  let body
  if (message.value?.data?.payload?.parts) {
    body = message.value?.data?.payload?.parts[1]?.body?.data
  } else {
    isBodyWithParts = true
    body = message.value?.data?.payload?.body?.data
  }
  if (!body) {
    return null
  }

  const base64text = body.replace(/-/g, '+').replace(/_/g, '/')
  const decodedText = Buffer.from(base64text, 'base64').toString('utf8')
  const bodyData = decodedText

  // return { subject, from, to, date, snippet, isUnread, isBodyWithParts }
  return { subject, from, to, date, snippet, isUnread, isBodyWithParts, bodyData }
}
export default async function Gmail({ mail }: { mail: Account }) {
  const mess = await getMessagesAndContent(mail.accessToken, mail.refreshToken)
  const messagesData = mess.map(message => {
    return getMessageData(message)
  })
  // console.log('DATA', messagesData)

  return (
    <>
      <div>Mails</div>
      <div>{mail.name}</div>
      <div></div>
      {messagesData &&
        messagesData.map(mess =>
          mess?.isBodyWithParts ? (
            <div style={{ whiteSpace: 'pre-wrap' }}>{mess?.bodyData}</div>
          ) : mess?.bodyData ? (
            <div dangerouslySetInnerHTML={{ __html: mess?.bodyData }} />
          ) : null,
        )}
    </>
  )
}
