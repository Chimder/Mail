import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
// import { Account, PrismaClient, User } from '@prisma/client'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

import { decrypt, encrypt } from '@/lib/auth/actions'

// const prisma = new PrismaClient()
export interface MainSession {
  user: User
  expires: number
  iat: number
}
type User = {
  id: string
  accounts: Account[]
}

type Account = {
  name: string
  picture: string
  providerId: string
  providerAccountId: string
  email: string
  accessToken: string
  refreshToken: string
  userId: string
}

export async function GET(req: NextRequest, res: NextResponse) {
  if (req.method === 'GET') {
    console.log('REQURL', req.nextUrl.origin)
    const code = req.nextUrl.searchParams.get('code') as string
    const redirect_uri = 'http://localhost:3000/api/auth/callback'
    const response = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri,
      grant_type: 'authorization_code',
    })
    const { access_token, refresh_token } = response.data
    const profileResponse = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    })

    const { email, id: googleId, picture, name } = profileResponse.data
    //////////////////////////////////////////////////////////////////////////////////////////////

    const session = cookies().get('sessionGoogle')?.value
    if (session) {
      const parsed: MainSession = await decrypt(session)
      console.log('parsedDATA', parsed)

      //filter acount
      const accountIndex = parsed.user.accounts.find(
        (acc: Account) => acc.providerId === 'google' && acc.providerAccountId === googleId,
      )
      console.log('ACCINDEX', accountIndex)

      if (accountIndex) {
        //update account
        accountIndex.accessToken = access_token
        accountIndex.refreshToken = refresh_token

        cookies().set('sessionGoogle', await encrypt(parsed), {
          expires: new Date().setFullYear(new Date().getFullYear() + 1),
          httpOnly: true,
        })
        return NextResponse.redirect(req.nextUrl.origin)
      } else {
        //create account
        const newAccount: Account = {
          name,
          providerId: 'google',
          providerAccountId: googleId,
          email,
          picture,
          accessToken: access_token,
          refreshToken: refresh_token,
          userId: parsed.user.id,
        }
        parsed.user.accounts.push(newAccount)

        cookies().set('sessionGoogle', await encrypt(parsed), {
          expires: parsed.expires,
          httpOnly: true,
        })
        return NextResponse.redirect(req.nextUrl.origin)
      }
    } else {
      //create new user and account//
      //gen id random
      const newUserId = uuidv4()
      const user: User = {
        id: newUserId,
        accounts: [],
      }
      const account: Account = {
        name,
        providerId: 'google',
        providerAccountId: googleId,
        email,
        picture,
        accessToken: access_token,
        refreshToken: refresh_token,
        userId: newUserId,
      }
      user.accounts.push(account)

      const session = { user, expires: new Date().setFullYear(new Date().getFullYear() + 1) }
      cookies().set('sessionGoogle', await encrypt(session), {
        expires: session.expires,
        httpOnly: true,
      })
      return NextResponse.redirect(req.nextUrl.origin)
    }
  } else {
    // res.status(405).end() // Method Not Allowed
    return NextResponse.redirect(req.nextUrl.origin)
  }
}
