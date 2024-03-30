// import { useState } from 'react'
import { Tally1, Tally2 } from 'lucide-react'

import { getMessagesAndContent } from '@/app/(auth)/google/_auth/options'
import { Account } from '@/app/(auth)/google/_auth/types'

export default async function Gmail({ mail }: { mail: Account }) {
  // const [selectedMessage, setSelectedMessage] = useState<any>(null)
  const messagesData = await getMessagesAndContent(mail.accessToken, mail.refreshToken)

  return (
    <div className="flex h-[100vh] w-full overflow-x-hidden ">
      <div className="overflow-y-scroll">
        {messagesData &&
          messagesData?.map((mess, i) => (
            <ul
              key={`${mess?.snippet} + ${i}`}
              className="flex max-w-[600px] items-center justify-start pl-20 pt-2"
              // onClick={() => setSelectedMessage(mess)}
            >
              <li className="flex items-center justify-start divide-y divide-dashed divide-blue-200">
                <div>
                  {mess?.isUnread ? (
                    <Tally2 className="h-6 w-6 pr-1 text-sky-600" />
                  ) : (
                    <Tally1 className="h-6 w-6 text-orange-500" />
                  )}
                </div>
                <div className="">
                  <div className="flex justify-between">
                    <div className="flex text-base">{mess?.from}</div>
                    <div className="text-sm text-black">{mess?.date}</div>
                  </div>
                  <div className="text-sm text-black/95">{mess?.subject}</div>
                  <div className="text-sm text-black/70">{mess?.snippet}</div>
                </div>
              </li>
            </ul>
          ))}
      </div>
      {/* {selectedMessage?.isBodyWithParts ? (
        <div style={{ whiteSpace: 'pre-wrap' }}>{selectedMessage?.bodyData}</div>
      ) : selectedMessage?.bodyData ? (
        <div dangerouslySetInnerHTML={{ __html: selectedMessage?.bodyData }} />
      ) : null} */}
    </div>
  )
}
