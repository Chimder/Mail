'use client'

import React, { useState } from 'react'
import { formatDate, formatTempDate } from '@/shared/lib/data-format'
import { useQuery } from '@tanstack/react-query'
import { RotateCw, Tally1, Tally2 } from 'lucide-react'
import { useFormState } from 'react-dom'

import { getMessageBody, getTempMessages } from '@/app/(auth)/temp/_auth/options'
import { HydraMember, TempAccount } from '@/app/(auth)/temp/_auth/types'

import { Button } from './ui/button'
import Spinner from './spiner'

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

  // console.log('MESSBODY', messBody)

  const {
    data: mess,
    isPending,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ['temp', accountData.email],
    queryFn: () => getTempMessages(accountData.accessToken, '1'),
    refetchOnWindowFocus: false,
    retry: 0,
  })

  // console.log('allMEss', mess)

  if (isPending) {
    return <Spinner />
  }
  return (
    <div className="grid h-[100vh] grid-cols-5 bg-white pt-[6.8vh]">
      <section className="col-span-2 flex flex-col items-center justify-start pl-[12vw] ">
        <div className="m-0 flex h-[89vh] w-full flex-col items-center justify-start overflow-x-hidden overflow-y-scroll p-0">
          <Button onClick={() => refetch()}>
            {isRefetching ? <RotateCw className="mb-2 animate-spin " /> : 'REF'}
          </Button>
          {mess?.['hydra:member'].map((mess: HydraMember) => (
            <div
              key={`${mess['@id']}`}
              className={`ml-0 flex w-full cursor-pointer justify-center !pl-0 hover:bg-black/15 `}
              onClick={() => setMessBody(mess.id)}
            >
              <div className="flex w-full items-center justify-start divide-y divide-dashed divide-blue-200">
                <Tally2 className="h-6 w-6 pr-1 text-sky-600" />
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
        <iframe
          className="flex h-full w-full flex-col items-center justify-center overflow-x-hidden font-sans"
          srcDoc={messBody?.html[0]}
        />
      </section>
    </div>
  )
}
