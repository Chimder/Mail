'use client'

import { useEffect, useState } from 'react'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { RotateCw, Tally1, Tally2 } from 'lucide-react'
import { useInView } from 'react-intersection-observer'

import { getMessagesAndContent } from '@/app/(auth)/google/_auth/options'

type Messs = {
  subject: any
  from: any
  to: any
  date: any
  snippet: any
  isUnread: any
  isBodyWithParts: boolean
  bodyData: string
}
type Mess = {
  messagesData: ({
    subject: any
    from: any
    to: any
    date: any
    snippet: any
    isUnread: any
    isBodyWithParts: boolean
    bodyData: string
  } | null)[]
  nextPageToken: string | null | undefined
}
type Props = {
  accountData?: any
}

export default function Gmail({ accountData }: Props) {
  const [selectedMessage, setSelectedMessage] = useState<any>()

  const fetchMessPages = async ({ pageParam }: { pageParam?: number }) => {
    const response = await getMessagesAndContent(
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
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['mangas'],
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
  const mailDatas = mailData?.pages.flatMap(page => page?.messagesData)
  console.log('>>>>>', mailDatas)

  const { ref, inView } = useInView()
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView])

  return (
    <div className="grid h-[100vh] grid-cols-5 bg-white">
      <section className="col-span-2 flex flex-col items-center justify-center pl-[12vw] ">
        <div className="flex h-[94vh] w-full flex-col items-center justify-start overflow-x-hidden overflow-y-scroll">
          {mailDatas &&
            mailDatas?.map((mess, i) => (
              <ul
                ref={ref}
                key={`${mess?.snippet} + ${i}`}
                className="ml-0 flex w-full justify-center !pl-0"
                onClick={() => setSelectedMessage(mess)}
              >
                <li className="flex w-full items-center justify-start divide-y divide-dashed divide-blue-200">
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
                      <div className="text-sm text-black">{mess?.date}</div>
                    </div>
                    <div className="line-clamp-1 overflow-hidden text-ellipsis text-sm text-black/95">
                      {mess?.subject}
                    </div>
                    <div className="line-clamp-2 text-sm text-black/70">{mess?.snippet}</div>
                  </div>
                </li>
              </ul>
            ))}
        </div>
        <div>{isFetchingNextPage && <RotateCw className="mb-2 animate-spin " />}</div>
      </section>

      <section className="col-span-3 flex w-full flex-col items-center justify-center overflow-x-hidden bg-white">
        {selectedMessage?.isBodyWithParts ? (
          <div
            className="w-full px-4"
            key={selectedMessage?.bodyData}
            style={{ whiteSpace: 'pre-wrap' }}
          >
            {selectedMessage?.bodyData}
          </div>
        ) : selectedMessage?.bodyData ? (
          <div dangerouslySetInnerHTML={{ __html: selectedMessage?.bodyData }} />
        ) : null}
      </section>
    </div>
  )
}
