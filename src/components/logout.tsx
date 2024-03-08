'use client'

import React from 'react'
import { signIn, signOut } from 'next-auth/react'

import { Button } from './ui/button'

type Props = {}

export default function Logout({}: Props) {
  return <Button onClick={() => signOut()}>Logout</Button>
}
