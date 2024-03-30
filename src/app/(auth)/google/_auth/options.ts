'use server'

import { cookies } from 'next/headers'
import { google } from 'googleapis'
import { jwtVerify, SignJWT } from 'jose'

import { MainSession } from './types'

// let google: any
//
// if (typeof window === 'undefined') {
// google = require('googleapis').google
// }

const secretKey = process.env.NEXT_AUTH_SECRET
const key = new TextEncoder().encode(secretKey)

export async function encrypt(payload: any) {
  return await new SignJWT(payload).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().sign(key)
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ['HS256'],
  })
  return payload
}
export async function getSession(): Promise<MainSession | null> {
  const session = cookies().get('sessionGoogle')?.value
  if (!session) return null
  return await decrypt(session)
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
    maxResults: 2,
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
    // console.log('BODY', body)

    const base64text = body.replace(/-/g, '+').replace(/_/g, '/')
    const decodedText = Buffer.from(base64text, 'base64').toString('utf8')
    const bodyData = decodedText

    return { subject, from, to, date, snippet, isUnread, isBodyWithParts, bodyData }
  })
  // console.log('ME@@@<<<<<<<', messagesData)
  return { messagesData, nextPageToken }
}
