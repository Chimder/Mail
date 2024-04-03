import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

async function getTempEmail() {
  const domains = await getDomains()
  const username = uuidv4().substring(0, 8)
  const password = uuidv4().substring(0, 12)
  const address = `${username}@${domains['hydra:member'][0].domain}`

  try {
    // Создание нового аккаунта
    await axios.post('https://api.mail.tm/accounts', {
      address: address,
      password: password,
    })

    // Вход в аккаунт
    const loginResponse = await axios.post('https://api.mail.tm/token', {
      address: address,
      password: password,
    })

    const token = loginResponse.data.token

    console.log(token)

    // Получение списка писем
    const messages = await axios.get(`https://api.mail.tm/messages?page=1`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    console.log(messages.data)
  } catch (error) {
    console.error(error)
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
