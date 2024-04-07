'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

import { decrypt, encrypt } from '../../google/_auth/options'
import { TempAccount, TempMess } from './types'

export async function getTempSession(): Promise<TempAccount[] | null> {
  const cookiesAll = cookies()
  const tempAccounts = cookiesAll.getAll().filter(cookie => cookie.name.startsWith('tempmail_'))
  if (!tempAccounts || tempAccounts.length === 0) {
    console.error('No tempmail cookies found')
    return null
  }
  const accounts = await Promise.all(
    tempAccounts.map(cookie => {
      if (!cookie.value) {
        console.error('Cookie value is undefined')
        return null
      }
      return decrypt(cookie.value)
    }),
  )
  return accounts.filter(account => account !== null)
}

export async function regTempEmailAccount() {
  const domains = await getDomains()
  if (!domains || !domains['hydra:member'] || domains['hydra:member'].length === 0) {
    console.error('No domains available')
    return undefined
  }
  console.log('DOMAINS', domains)
  const username = uuidv4().substring(0, 8)
  const password = uuidv4().substring(0, 12)
  const address = `${username}@${domains['hydra:member'][0].domain}`

  try {
    const accountResponse = await axios.post('https://api.mail.tm/accounts', {
      address: address,
      password: password,
    })
    console.log('ACCRESP', accountResponse)

    const loginResponse = await axios.post('https://api.mail.tm/token', {
      address: address,
      password: password,
    })

    const newAccount: TempAccount = {
      email: address,
      provider: 'mail.tm',
      accessToken: loginResponse.data.token,
      expires: new Date().setDate(new Date().getDate() + 1),
    }

    cookies().set(`tempmail_${address}`, await encrypt(newAccount), {
      expires: newAccount.expires,
      httpOnly: true,
    })
  } catch (error) {
    console.error('Error during account creation or login:', error)
    redirect('/')
    return undefined
  }
  redirect(`temp/${address}`)
}

export async function deleteTempMail(email: string) {
  cookies().delete(`tempmail_${email}`)
  const activeAccount = await getTempSession()
  if (!activeAccount) redirect('/')
  redirect(`/temp/${activeAccount[0].email}`)
}

export async function getTempMessages(token: string, page: string): Promise<TempMess | undefined> {
  try {
    if (!page) {
      page = '1'
    }
    const messages = await axios.get(`https://api.mail.tm/messages?page=${page}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return messages.data
  } catch (error) {
    console.log(error)
  }
}
export async function getMessageBody(token?: string, messageId?: string) {
  if (!token || !messageId) {
    return undefined
  }

  try {
    const message = await axios.get(`https://api.mail.tm/messages/${messageId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return message.data
  } catch (error) {
    console.log(error)
  }
}

async function getDomains() {
  try {
    const response = await axios.get('https://api.mail.tm/domains')
    if (response.status !== 200) {
      console.error('Error retrieving domains:', response.status, response.statusText)
      return null
    }
    return response.data
  } catch (error) {
    console.error('Error retrieving domains:', error)
    return null
  }
}
