
export class Cnpj {
  validate(value: string): boolean {
    value = value.replace(/[^\d]+/g, '')

    if (value == '') return false

    if (value.length != 14) return false

    if (
      value == '00000000000000' ||
      value == '11111111111111' ||
      value == '22222222222222' ||
      value == '33333333333333' ||
      value == '44444444444444' ||
      value == '55555555555555' ||
      value == '66666666666666' ||
      value == '77777777777777' ||
      value == '88888888888888' ||
      value == '99999999999999'
    )
      return false

    let size = value.length - 2
    let numbers = value.substring(0, size)
    const digits = value.substring(size)
    let sum = 0
    let pos = size - 7
    for (let i = size; i >= 1; i--) {
      sum += parseInt(numbers.charAt(size - i)) * pos--
      if (pos < 2) pos = 9
    }
    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
    if (result != parseInt(digits.charAt(0))) return false

    size = size + 1
    numbers = value.substring(0, size)
    sum = 0
    pos = size - 7
    for (let i = size; i >= 1; i--) {
      sum += parseInt(numbers.charAt(size - i)) * pos--
      if (pos < 2) pos = 9
    }
    result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
    if (result != parseInt(digits.charAt(1))) return false

    return true
  }
}
