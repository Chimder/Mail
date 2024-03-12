import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import { jwtVerify, SignJWT } from 'jose'

import { MainSession } from '@/app/api/auth/callback/route'

const secretKey = process.env.NEXT_AUTH_SECRET
console.log('SECRETKEY', secretKey)
const key = new TextEncoder().encode(secretKey)

export async function encrypt(payload: any) {
  console.log('payload', payload)
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    // .setExpirationTime('10 sec from now')
    .sign(key)
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

export async function getMessages(providerAccountId: string) {
  // const account: Account | null = await prisma.account.findFirst({
  //   where: { providerAccountId },
  // })
  const account = true

  if (!account) {
    throw new Error('Account not found')
  }

  // Создаем клиента OAuth2 и устанавливаем токены
  // const oauth2Client = new google.auth.OAuth2(
  //   process.env.GOOGLE_CLIENT_ID,
  //   process.env.GOOGLE_CLIENT_SECRET,
  // )
  // oauth2Client.setCredentials({
  //   access_token: account.accessToken,
  //   refresh_token: account.refreshToken,
  // })

  // Создаем клиента Gmail и получаем список сообщений
  // const gmail = google.gmail({ version: 'v1', auth: oauth2Client })
  // const { data } = await gmail.users.messages.list({ userId: 'me' })

  // return data
}
