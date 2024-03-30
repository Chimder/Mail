'use client'

import React, { useState } from 'react'

type Props = {
  data:any
}

export default function SelectedMessag({ data }: Props) {
  const [selectedMessage, setSelectedMessage] = useState<any>(null)
  return (
    <div>
      {selectedMessage?.isBodyWithParts ? (
        <div style={{ whiteSpace: 'pre-wrap' }}>{selectedMessage?.bodyData}</div>
      ) : selectedMessage?.bodyData ? (
        <div dangerouslySetInnerHTML={{ __html: selectedMessage?.bodyData }} />
      ) : null}
    </div>
  )
}
