import { Account, PrismaClient } from '@prisma/client'
import { google } from 'googleapis'

const prisma = new PrismaClient()

export async function getMessages(providerAccountId: string) {

  const account: Account | null = await prisma.account.findFirst({
    where: { providerAccountId },
  })

  if (!account) {
    throw new Error('Account not found')
  }

  // Создаем клиента OAuth2 и устанавливаем токены
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
  )
  oauth2Client.setCredentials({
    access_token: account.accessToken,
    refresh_token: account.refreshToken,
  })

  // Создаем клиента Gmail и получаем список сообщений
  const gmail = google.gmail({ version: 'v1', auth: oauth2Client })
  const { data } = await gmail.users.messages.list({ userId: 'me' })

  return data
}
