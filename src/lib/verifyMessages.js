/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */

export function ordinal(count) {
  const value = Number(count) || 0
  const teen = value % 100
  if (teen >= 11 && teen <= 13) return `${value}th`
  switch (value % 10) {
    case 1: return `${value}st`
    case 2: return `${value}nd`
    case 3: return `${value}rd`
    default: return `${value}th`
  }
}

export function verifyCopy({ result, code, count, firstVerifiedAt }) {
  if (result === 'genuine') {
    return {
      title: 'Code Confirmed!',
      message: 'Congratulations! The product ID you just checked is an authentic TOPBAR product. Thanks for your support!',
    }
  }
  if (result === 'not_authentic' || result === 'invalid_format' || result === 'disabled' || result === 'expired') {
    return {
      title: 'The security code does not exist!',
      message: 'Please beware of fake products! If you have any questions, please contact customer service.',
    }
  }
  const number = code || 'Unknown'
  const when = firstVerifiedAt || 'an unknown time'
  if (result === 'over_verified') {
    return {
      title: `Verification Number: ${number}`,
      message: `This verification number is invalid due to more than four verifications. The first verification occurred ${when}.`,
    }
  }
  if (result === 'already_verified') {
    return {
      title: `Verification Number: ${number}`,
      message: `This is the ${ordinal(count)} verification. The first verification occurred ${when}. If you believe this information to be incorrect, please contact your retailer.`,
    }
  }
  return null
}
