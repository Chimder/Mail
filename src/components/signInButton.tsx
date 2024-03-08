'use client'

import React from 'react'
import { signIn, useSession } from 'next-auth/react'

import { Button } from './ui/button'

type Props = {}

export default function SignInButton({}: Props) {
  // const { data: session } = useSession()
  return (
    <div>
      <Button onClick={() => signIn()}>signInButton</Button>
    </div>
  )
}
