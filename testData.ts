const testData = JSON.parse(Deno.readTextFileSync('./testDataPersonal.json'));

export type UserCredentials = {
  phoneNumber: string
  fullPhoneNumber: string
  passcode: string
}

type UserExtra = {
  countryCode: string
  email: string
}

export type User = UserCredentials & UserExtra

export const getRandomSpanishPhone = () => {
  const countryCode = '+34'
  const phoneNumber =
    '91' +
    Math.floor(Math.random() * 9999999)
      .toString()
      .padStart(7, '0')
  const fullPhoneNumber = countryCode + phoneNumber
  return { countryCode, phoneNumber, fullPhoneNumber }
}

export const getRandomEmail = () => {
  return `random+${Math.floor(Math.random() * 9999999)
    .toString()
    .padStart(7, '0')}@gmail.com`
}

export const getRandomUser = (): User => {
  const rnd = getRandomSpanishPhone()
  const email = `random${rnd.fullPhoneNumber}@gmail.com`
  // Creating a "non-weak" passcode.
  const passcode = '235689'
    .split('')
    .sort(() => 0.5 - Math.random())
    .join('')
  return { ...rnd, email, passcode }
}

const rnd = (n: number) => {
  return Math.floor(Math.random() * n)
}

const rndEntry = (n: string[]) => {
  const index = Math.floor(Math.random() * n.length)
  return n[index]
}

export const getRandomPersonalData = () => {
  return {
    address: `${rndEntry(testData.streetPrefixes)} ${rndEntry(testData.streets)} ${1 + rnd(98)}, ${
      1 + rnd(4)
    }º, ${1 + rnd(3)}ª`,
    city: rndEntry(testData.cities),
    postalCode:
      '28' +
      Math.floor(Math.random() * 999)
        .toString()
        .padStart(3, '0'),
    firstName: rndEntry(testData.firstNames),
    lastName: rndEntry(testData.lastNames),
    dateOfBirth: `19${(70 + rnd(29)).toString()}-${(1 + rnd(11)).toString().padStart(2, '0')}-${(
      1 + rnd(27)
    )
      .toString()
      .padStart(2, '0')}`,
    residency: 'Spain',
    nationality: 'Spain',
    countryCode: 'ES',
  }
}
