import format from 'date-fns/format/index.js'
import add from 'date-fns/add/index.js'

let date = ''
let formattedDate = ''

export function getNextDays () {
  const dayTwo = format(add(date, { days: 1 }), 'E')
  const dayThree = format(add(date, { days: 2 }), 'E')
  const dayFour = format(add(date, { days: 3 }), 'E')
  const dayFive = format(add(date, { days: 4 }), 'E')
  const daySix = format(add(date, { days: 5 }), 'E')
  return ([dayTwo, dayThree, dayFour, dayFive, daySix])
}

export function getCurrentDate () {
  formattedDate = format(date, 'eeee, MMM, do')
  return formattedDate
}

export function setLocaleDate (dataObject) {
  const convertedDate = (dataObject.localeDate) * 1000
  date = new Date(convertedDate)
}