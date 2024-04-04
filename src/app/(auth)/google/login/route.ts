import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export async function GET(req: NextRequest, res: NextResponse) {
  try {
    if (req.method === 'GET') {
      const redirect_uri = `${process.env.URL}/google/callback`
      const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${redirect_uri}&response_type=code&scope=openid%20profile%20email%20https://www.googleapis.com/auth/gmail.modify&access_type=offline&prompt=consent`
      return NextResponse.redirect(url)
    } else {
      NextResponse.error()
    }
  } catch (error) {
    console.log(error)
  }
}
