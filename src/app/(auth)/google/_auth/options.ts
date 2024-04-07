'use server'

import { cookies } from 'next/headers'
import { formatDate } from '@/shared/lib/data-format'
import { google } from 'googleapis'
import { jwtVerify, SignJWT } from 'jose'

import { GoogleAccount } from './types'
import { redirect } from 'next/navigation'

const secretKey = process.env.NEXT_AUTH_SECRET
const key = new TextEncoder().encode(secretKey)

export async function encrypt(payload: any) {
  return await new SignJWT(payload).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().sign(key)
}

export async function decrypt(input: string): Promise<any> {
  if (!input) {
    console.error('ER dECRYPT INPUT')
    return undefined
  }
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ['HS256'],
    })
    return payload
  } catch (error) {
    console.error('Error during decryption:', error);
    return undefined;
  }
}
export async function deleteGoogleMail(email: string) {
  cookies().delete(`googleMailer_${email}`)
  const activeAccount = await getGmailSession()
  if (!activeAccount) redirect('/')
  redirect(`/google/${activeAccount[0].email}`)
}

export async function getMessagesAndContent(
  accessToken: string,
  refreshToken: string,
  pageToken?: number,
) {
  if (!accessToken || !refreshToken) {
    throw new Error('Account not found')
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
  )
  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  })

  const gmail = google.gmail({ version: 'v1', auth: oauth2Client })
  const { data } = await gmail.users.messages.list({
    userId: 'me',
    maxResults: 100,
    pageToken: pageToken?.toString(),
  })

  const nextPageToken = data.nextPageToken

  if (!data.messages) {
    return undefined
  }

  const messages = await Promise.allSettled(
    data.messages.map(async (message: any) => {
      const fullMessage = await gmail.users?.messages.get({ userId: 'me', id: message.id })
      return fullMessage
    }),
  )

  const messagesData = messages.map((message: any) => {
    const headers = message.value?.data?.payload?.headers
    const subjectHeader = headers.find((header: any) => header.name === 'Subject')
    const fromHeader = headers.find((header: any) => header.name === 'From')
    const toHeader = headers.find((header: any) => header.name === 'To')
    const messageId = message.value?.data?.id
    const dateHeader = headers.find((header: any) => header.name === 'Date')

    const subject = subjectHeader ? subjectHeader.value : ''
    const to = toHeader ? toHeader.value : ''
    const snippet = message.value?.data?.snippet
    const isUnread = message.value?.data?.labelIds.includes('UNREAD')

    const from = fromHeader ? extractName(fromHeader.value) : ''
    const date = dateHeader ? formatDate(dateHeader.value) : ''

    let isBodyWithParts = false
    let body

    if (message.value?.data?.payload?.parts) {
      if (message.value?.data?.payload?.parts.length > 1) {
        body = message.value?.data?.payload?.parts[1]?.body?.data
      } else {
        body = message.value?.data?.payload?.parts[0]?.body?.data
      }
    } else {
      isBodyWithParts = true
      body = message.value?.data?.payload?.body?.data
    }

    let decodedText = ''
    if (body) {
      const base64text = body.replace(/-/g, '+').replace(/_/g, '/')
      decodedText = Buffer.from(base64text, 'base64').toString('utf8')
    }
    const bodyData = decodedText
    return { messageId, subject, from, to, date, snippet, isUnread, isBodyWithParts, bodyData }
  })
  return { messagesData, nextPageToken }
}

export async function getGmailSession(): Promise<GoogleAccount[] | null> {
  const cookiesAll = cookies()
  const tempAccounts = cookiesAll.getAll().filter(cookie => cookie.name.startsWith('googleMailer_'))
  const accounts = await Promise.all(tempAccounts.map(cookie => decrypt(cookie.value)))
  return accounts
}

function extractName(from: string) {
  const match = from.match(/(.*)<.*>/)
  return match ? match[1].trim() : from
}
export async function markAsRead(accessToken: string, refreshToken: string, messageId: string) {
  if (!accessToken || !refreshToken) {
    throw new Error('Account not found')
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
  )
  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  })

  const gmail = google.gmail({ version: 'v1', auth: oauth2Client })

  await gmail.users.messages.modify({
    userId: 'me',
    id: messageId,
    requestBody: {
      removeLabelIds: ['UNREAD'],
    },
  })
}
