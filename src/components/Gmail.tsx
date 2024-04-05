'use client'

import { useEffect, useState } from 'react'
import { useInfiniteQuery, useMutation } from '@tanstack/react-query'
import { LogOut, RotateCw, Tally1, Tally2 } from 'lucide-react'
import { useInView } from 'react-intersection-observer'

import { getMessagesAndContent, markAsRead } from '@/app/(auth)/google/_auth/options'
import { GoogleAccount, mailDatas } from '@/app/(auth)/google/_auth/types'

import CopyMail from './copy'
import Spinner from './spiner'
import { Badge } from './ui/badge'

type Props = {
  accountData: GoogleAccount
}

export default function Gmail({ accountData }: Props) {
  const [selectedMessage, setSelectedMessage] = useState<any>()
  const [mailDatas, setMailDatas] = useState<mailDatas[]>([])

  const fetchMessPages = async ({ pageParam }: { pageParam?: number }) => {
    const response: any = await getMessagesAndContent(
      accountData?.accessToken,
      accountData?.refreshToken,
      pageParam,
    )
    return response
  }
  const {
    data: mailData,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isPending,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: [`${accountData.email}`],
    queryFn: fetchMessPages,
    getNextPageParam: (lastPage: any) => {
      if (!lastPage?.nextPageToken) {
        return undefined
      }
      return lastPage.nextPageToken
    },
    initialPageParam: undefined,
    enabled: !!accountData,
    refetchOnWindowFocus: false,
    retry: 2,
  })

  useEffect(() => {
    if (mailData) {
      setMailDatas(mailData.pages.flatMap(page => page?.messagesData))
    }
  }, [mailData])

  const { mutate } = useMutation({
    mutationKey: ['read'],
    mutationFn: ({ messId }: { messId: string }) =>
      markAsRead(accountData?.accessToken, accountData?.refreshToken, messId),
    onSuccess: (data, variables) => {
      const updatedMailDatas = mailDatas.map(mess =>
        mess.messageId === variables.messId ? { ...mess, isUnread: false } : mess,
      )
      setMailDatas(updatedMailDatas)
    },
  })

  const chooseMessage = (data: Partial<mailDatas>) => {
    mutate({ messId: data.messageId })
    setSelectedMessage(data!)
  }

  const { ref, inView } = useInView()
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView])

  if (isPending) {
    return <Spinner />
  }
  console.log('MEILDATA', mailData)

  return (
    <div className="grid h-[100vh] grid-cols-5 bg-white pt-[6.8vh]">
      <section className="col-span-2 flex flex-col items-center justify-start pl-[12vw] ">
        <div className="m-0 flex h-[89vh] w-full flex-col items-center justify-start overflow-x-hidden overflow-y-scroll p-0">
          <div className="flex my-1 w-full h-full items-center justify-evenly">
            <Badge>{accountData.email}</Badge>
            <CopyMail mail={accountData.email} />
            <RotateCw
              onClick={() => refetch()}
              className={`${isFetching ? 'animate-spin' : ''}`}
            />
            <LogOut />
          </div>
          {mailDatas &&
            mailDatas?.map((mess, i) => (
              <div
                ref={ref}
                key={`${mess.snippet} + ${i}`}
                className={`ml-0 flex w-full cursor-pointer justify-center !pl-0 hover:bg-black/15 ${selectedMessage?.messageId == mess.messageId ? 'bg-black/20' : ''}`}
                onClick={() => chooseMessage(mess)}
              >
                <div className="flex w-full items-center justify-start divide-y divide-dashed divide-blue-200">
                  <div>
                    {mess?.isUnread ? (
                      <Tally2 className="h-6 w-6 pr-1 text-sky-600" />
                    ) : (
                      <Tally1 className="h-6 w-6 text-orange-500" />
                    )}
                  </div>
                  <div className="w-full">
                    <div className="flex justify-between">
                      <div className="flex text-base">{mess?.from}</div>
                      <div className="pr-1 text-sm text-black">{mess?.date}</div>
                    </div>
                    <div className="line-clamp-1 w-full overflow-hidden text-ellipsis text-sm text-black/95">
                      {mess?.subject}
                    </div>
                    <div className="line-clamp-2 w-full text-sm text-black/70">{mess?.snippet}</div>
                  </div>
                </div>
              </div>
            ))}
        </div>
        <div>{isFetchingNextPage && <RotateCw className="mb-2 animate-spin " />}</div>
      </section>

      <section className="col-span-3 flex w-full flex-col items-center justify-center  overflow-x-hidden ">
        {selectedMessage?.bodyData && /<[a-z][\s\S]*>/i.test(selectedMessage?.bodyData) ? (
          <iframe
            className="flex h-full w-full flex-col items-center justify-center overflow-x-hidden font-sans"
            srcDoc={selectedMessage?.bodyData}
          />
        ) : (
          <div
            className=" flex w-full flex-col items-center justify-center whitespace-pre-wrap px-4"
            key={selectedMessage?.bodyData}
          >
            {selectedMessage?.bodyData}
          </div>
        )}
      </section>
    </div>
  )
}
