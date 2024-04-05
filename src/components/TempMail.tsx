'use client'

import React, { useState } from 'react'
import { formatTempDate } from '@/shared/lib/data-format'
import { useQuery } from '@tanstack/react-query'
import { LogOut, RotateCw, Tally1 } from 'lucide-react'

import { deleteTempMail, getMessageBody, getTempMessages } from '@/app/(auth)/temp/_auth/options'
import { HydraMember, TempAccount } from '@/app/(auth)/temp/_auth/types'

import CopyMail from './copy'
import Spinner from './spiner'
import { Badge } from './ui/badge'
import { Button } from './ui/button'

type Props = {
  accountData: TempAccount
}

export default function TempMail({ accountData }: Props) {
  const [messageId, setMessBody] = useState<string | undefined>()

  const { data: messBody, isPending: pendingMessBody } = useQuery({
    queryKey: ['temp', messageId],
    queryFn: () => getMessageBody(accountData.accessToken, messageId),
    refetchOnWindowFocus: false,
    retry: 0,
  })

  const {
    data: mess,
    isPending,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['temp', accountData.email],
    queryFn: () => getTempMessages(accountData.accessToken, '1'),
    refetchOnWindowFocus: false,
    retry: 0,
  })

  if (isPending) {
    return <Spinner />
  }

  return (
    <div className="grid h-[100vh] grid-cols-5 bg-white pt-[6.8vh]">
      <section className="col-span-2 flex flex-col items-center justify-start pl-[12vw] ">
        <div className="my-2 flex w-full items-center justify-evenly">
          <Button>{accountData.email}</Button>
          <CopyMail mail={accountData.email} />
          <RotateCw onClick={() => refetch()} className={`${isFetching ? 'animate-spin' : ''}`} />
          <LogOut className="cursor-pointer" onClick={() => deleteTempMail(accountData.email)} />
        </div>
        <div className="m-0 flex h-[87vh] w-full flex-col items-center justify-start overflow-x-hidden overflow-y-scroll p-0">
          {mess?.['hydra:member'].map((mess: HydraMember) => (
            <div
              key={mess.id}
              className={`ml-0 flex w-full cursor-pointer justify-center !pl-0 hover:bg-black/15 ${messageId == mess.id ? 'bg-black/20' : ''}`}
              onClick={() => setMessBody(mess.id)}
            >
              <div className="flex w-full items-center justify-start divide-y divide-dashed divide-blue-200">
                <Tally1 className="h-6 w-6 pr-1 text-orange-500" />
                <div className="w-full">
                  <div className="flex justify-between">
                    <div className="flex text-base">{mess?.from.name}</div>
                    <div className="pr-1 text-sm text-black">{formatTempDate(mess.createdAt)}</div>
                  </div>
                  <div className="line-clamp-1 w-full overflow-hidden text-ellipsis text-sm text-black/95">
                    {mess?.subject}
                  </div>
                  <div className="line-clamp-2 w-full text-sm text-black/70">{mess?.intro}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="col-span-3 flex w-full flex-col items-center justify-center  overflow-x-hidden ">
        {messBody && (
          <iframe
            key={messBody.id}
            className="flex h-full w-full flex-col items-center justify-center overflow-x-hidden font-sans"
            srcDoc={messBody.html[0]}
          />
        )}
      </section>
    </div>
  )
}
