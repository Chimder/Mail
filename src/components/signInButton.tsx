'use client'

import React from 'react'
import Link from 'next/link'
import { redirects } from '@/shared/lib/constants'

type Props = {}

export default function SignInButton({}: Props) {
  // const { data: session } = useSession()
  return (
    <div>
      <Link href={redirects.toGoogleLogin}>signInButton</Link>
    </div>
  )
}
