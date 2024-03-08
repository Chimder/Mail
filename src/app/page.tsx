import { getServerSession } from 'next-auth'

import { getMessages } from '@/lib/auth/actions'
import authOptions from '@/lib/auth/options'
import Logout from '@/components/logout'
import SignInButton from '@/components/signInButton'
import { Test } from '@/components/test'

export default async function Home() {
  const session = await getServerSession(authOptions)

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>{session?.user?.email}</div>
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Get started by editing&nbsp;
          <Logout></Logout>
        </p>
      </div>
      <SignInButton></SignInButton>
      <Test />
    </main>
  )
}
