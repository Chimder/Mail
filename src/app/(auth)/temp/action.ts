'use server'

import { pages } from 'next/dist/build/templates/app-page'
import { cookies } from 'next/headers'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

import { decrypt, encrypt } from '../google/_auth/options'

interface Account {
  email: string
  provider: string
  accessToken: string
  expires: number
}

interface Session {
  accounts: Account[]
  expires: number
}

export async function test() {
  console.log('COOOOCKOKIIEIEI')
  cookies().set('testtt', 'testtt')
}

export async function regTempEmailAccount() {
  const domains = await getDomains()
  const username = uuidv4().substring(0, 8)
  const password = uuidv4().substring(0, 12)
  const address = `${username}@${domains['hydra:member'][0].domain}`

  try {
    await axios.post('https://api.mail.tm/accounts', {
      address: address,
      password: password,
    })

    const loginResponse = await axios.post('https://api.mail.tm/token', {
      address: address,
      password: password,
    })
    console.log('LOGINRES', loginResponse.data)

    const token = loginResponse.data.token

    const newAccount: Account = {
      email: address,
      provider: 'mail.tm',
      accessToken: loginResponse.data.token,
      expires: new Date().setDate(new Date().getDate() + 1),
    }

    let session = cookies().get('sessionTempTm')?.value
    console.log('SESSSION', session)
    let parsed: Session | null = null
    if (session) {
      parsed = (await decrypt(session)) as Session
    } else {
      parsed = { accounts: [], expires: new Date().setDate(new Date().getDate() + 1) }
    }
    parsed.accounts.push(newAccount)
    console.log('PARSED', parsed)

    cookies().set('sessionTempTm', await encrypt(parsed), {
      expires: parsed.expires,
      httpOnly: true,
    })
  } catch (error) {
    console.error(error)
  }
}

export async function getMessages(token: string, page: string) {
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

async function getDomains() {
  try {
    const response = await axios.get('https://api.mail.tm/domains')
    return response.data
  } catch (error) {
    console.error(error)
  }
}
