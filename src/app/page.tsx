import * as React from 'react'
import Link from 'next/link'
import { GoogleSvg, TempSvg } from '@/shared/accets/icons'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { getGmailSession } from './(auth)/google/_auth/options'
import { getTempSession, regTempEmailAccount } from './(auth)/temp/_auth/options'

export default async function Home() {
  const googleSession = await getGmailSession()
  const tempSession = await getTempSession()

  const limit = (googleSession?.length || 0) + (tempSession?.length || 0) === 6
  return (
    <main className="absolute flex h-full w-full items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Manage your mail</CardTitle>
          <CardDescription>Connect to Gmail or Temp mail</CardDescription>
          {limit && <CardTitle className="text-red-600 text-sm">Limit 6 mail</CardTitle>}
        </CardHeader>
        <CardContent>
          <div className="px-10">
            <div className="flex  flex-col items-center justify-center space-y-5">
              <Link className={`w-full ${limit && 'pointer-events-none'}`} href={`/google/login`}>
                <Button disabled={limit} className="w-full">
                  <GoogleSvg />
                  <div className="text-base">Google</div>
                </Button>
              </Link>
              <form
                className={`w-full ${limit && 'pointer-events-none'}`}
                action={regTempEmailAccount}
              >
                <Button className="w-full">
                  <TempSvg />
                </Button>
              </form>
            </div>
            <div className="flex flex-col space-y-1.5"></div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between"></CardFooter>
      </Card>
    </main>
  )
}
