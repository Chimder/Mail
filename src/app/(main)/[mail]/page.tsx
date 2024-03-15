import React from 'react'

type Props = {}

export default function Testt({ params }: { params: { mail: string } }) {
  return <div>{params.mail}</div>
}
