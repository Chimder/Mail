import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

import { decrypt, encrypt } from '../_auth/options'
import { GoogleAccount } from '../_auth/types'

export async function GET(req: NextRequest) {
  if (req.method === 'GET') {
    const code = req.nextUrl.searchParams.get('code') as string
    const redirect_uri = `${process.env.URL}/google/callback`
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

    const existingAccount = cookies().get(`googleMailer_${email}`)?.value
    if (existingAccount) {
      // Update existing account
      const account: GoogleAccount = await decrypt(existingAccount)
      account.accessToken = access_token
      account.refreshToken = refresh_token
      cookies().set(`googleMailer_${account.email}`, await encrypt(account), {
        expires: new Date().setFullYear(new Date().getFullYear() + 1),
        httpOnly: true,
      })
    } else {
      // Create new account
      const account: GoogleAccount = {
        name,
        providerId: 'google',
        providerAccountId: googleId,
        email,
        picture,
        accessToken: access_token,
        refreshToken: refresh_token,
        userId: uuidv4(),
      }
      cookies().set(`googleMailer_${account.email}`, await encrypt(account), {
        expires: new Date().setFullYear(new Date().getFullYear() + 1),
        httpOnly: true,
      })
    }
    return NextResponse.redirect(`${process.env.URL}/google/${email}`)
  } else {
    return NextResponse.redirect(req.nextUrl.origin)
  }
}
