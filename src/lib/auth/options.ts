import { AuthOptions } from 'next-auth'
import AzureADProvider from 'next-auth/providers/azure-ad'
import GoogleProvider from 'next-auth/providers/google'

import { prisma } from '../prisma'

const scopes = [
  // 'https://www.googleapis.com/auth/userinfo.email',
  // 'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/gmail.modify',
]

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          scope: 'openid profile email https://www.googleapis.com/auth/gmail.modify',
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID!,
      authorization: { params: { scope: 'openid profile user.Read email' } },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      if (account) {
        const email = user.email as string
        const providerId = account.provider as string
        const providerAccountId = account.providerAccountId as string
        const accessToken = account.access_token as string
        const refreshToken = account.refresh_token as string

        // Найдите пользователя по email
        const dbUser = await prisma.user.findFirst({
          where: {
            email: {
              hasSome: [email],
            },
          },
        })

        // Если пользователь существует, обновите или создайте аккаунт
        if (dbUser) {
          const existingAccount = await prisma.account.findUnique({
            where: {
              providerId_providerAccountId: {
                providerId,
                providerAccountId,
              },
            },
          })

          if (existingAccount) {
            await prisma.account.update({
              where: {
                providerId_providerAccountId: {
                  providerId,
                  providerAccountId,
                },
              },
              data: { accessToken, refreshToken },
            })
          } else {
            await prisma.account.create({
              data: {
                email,
                providerId,
                providerAccountId,
                accessToken,
                refreshToken,
                userId: dbUser.id,
              },
            })
          }
        }

        // Если пользователь не существует, создайте нового пользователя и аккаунт
        else {
          const newUser = await prisma.user.create({
            data: { email: [email] },
          })

          await prisma.account.create({
            data: {
              email,
              providerId,
              providerAccountId,
              accessToken,
              refreshToken,
              userId: newUser.id,
            },
          })
        }
      }

      return token
    },
  },
}

export default authOptions
