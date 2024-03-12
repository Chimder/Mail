'use client'

import React from 'react'
import Link from 'next/link'
import { signIn, useSession } from 'next-auth/react'

import { Button } from './ui/button'

type Props = {}

export default function SignInButton({}: Props) {
  // const { data: session } = useSession()
  return (
    <div>
      <Link href={'/api/auth/login'}>signInButton</Link>
    </div>
  )
}
