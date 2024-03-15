'use server'

import { cookies } from 'next/headers'
import { google } from 'googleapis'
import { jwtVerify, SignJWT } from 'jose'
import { MainSession } from './types'

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

export async function getMessages(accessToken: string, refreshToken: string) {
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
  const { data } = await gmail.users.messages.list({ userId: 'me' })

  return data
}
