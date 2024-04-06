'use client'

import React from 'react'
import { Copy } from 'lucide-react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import toast from 'react-hot-toast'

export default function CopyMail({ mail }: { mail: string }) {
  const setIsCopie = () => {
    toast.success('Copied', { position: 'top-left' })
  }

  return (
    <div>
      <CopyToClipboard text={mail} onCopy={() => setIsCopie()}>
        <Copy className="cursor-pointer" />
      </CopyToClipboard>

      {/* {copied ? <span style={{ color: 'red' }}>Скопировано.</span> : null} */}
    </div>
  )
}
