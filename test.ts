import { getRandomPersonalData, getRandomUser } from './testData.ts'

const createUser = async () => {
  const userData = getRandomUser()
  const personalData = getRandomPersonalData()
  const random = {
    personal_details: {
      firstName: personalData.firstName,
      lastName: personalData.lastName,
      dateOfBirth: personalData.dateOfBirth,
    },
    provide_email: { email: userData.email },
    card_address: {
      zipCode: personalData.postalCode,
      npmcountry: personalData.countryCode,
      address2: '',
      city: personalData.city,
      address1: personalData.address,
    },
    nationality: { countryCode: personalData.countryCode },
    phone: { preferredLanguage: personalData.countryCode, phoneNumber: userData.fullPhoneNumber },
    passcode: { passcode: userData.passcode },
  }
  const TEST_API_BASE_URL = 'http://test-api.' + Deno.args[0] + ':8001'
  const url = TEST_API_BASE_URL + '/setup/signup/ES_DIFY_DEBIT/completed'

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ steps: random }),
  })
  if (res.status === 200) {
    const jsonRes = await res.json()
    const signupId = jsonRes.data.signupId
    const statusUrl = TEST_API_BASE_URL + `/setup/signup/${signupId}`

    let checks = 0
    while (checks < 60) {
      const statusRes = await fetch(statusUrl)
      if (statusRes.status === 200) {
        const jsonStatus = await statusRes.json()
        console.log(checks, jsonStatus)
        if (jsonStatus.data.status !== 'IN_PROGRESS') {
          break
        }
      } else {
        console.error(`Status check returned status ${res.status}`)
      }
      checks++
      await new Promise((r) => setTimeout(r, 1000))
    }
    if (checks === 60) {
      Promise.reject('timeout')
    }
  } else {
    console.error(`Request returned status ${res.status}`)
  }
}

console.log('Sending three sequential requests.')
await createUser()
await createUser()
await createUser()
console.log('All sequential requests completed')

console.log('Sending three concurrent requests.')
const one = createUser()
const two = createUser()
const three = createUser()
Promise.all([one, two, three])
  .then(() => console.log('All concurrent requests completed'))
  .catch((r) => console.error('Request failed with ' + r))
