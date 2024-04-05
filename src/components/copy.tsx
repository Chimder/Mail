'use client'

import React from 'react'
import { Copy } from 'lucide-react'
import { CopyToClipboard } from 'react-copy-to-clipboard'

export default function CopyMail({ mail }: { mail: string }) {
  const [copied, setCopied] = React.useState(false)

  return (
    <div>
      <CopyToClipboard text={mail} onCopy={() => setCopied(true)}>
        <Copy className="cursor-pointer" />
      </CopyToClipboard>

      {copied ? <span style={{ color: 'red' }}>Скопировано.</span> : null}
    </div>
  )
}
