import format from 'date-fns/format/index.js'
import add from 'date-fns/add/index.js'

const localeDate = new Date()
const timeZoneOffset = localeDate.getTimezoneOffset() * 60 * 1000
const utcDate = new Date(localeDate.getTime() + timeZoneOffset)

let date = ''
let formattedDate = ''

export function getNextDays () {
  const dayOne = format(date, 'E')
  const dayTwo = format(add(date, { days: 1 }), 'E')
  const dayThree = format(add(date, { days: 2 }), 'E')
  const dayFour = format(add(date, { days: 3 }), 'E')
  const dayFive = format(add(date, { days: 4 }), 'E')
  const daySix = format(add(date, { days: 5 }), 'E')
  return ([dayOne, dayTwo, dayThree, dayFour, dayFive, daySix])
}

export function getCurrentDate () {
  formattedDate = format(date, 'eeee, MMM, do')
  return formattedDate
}

export function setLocaleDate (dataObject) {
  const timeZoneShift = (dataObject.timeZone) * 1000
  date = new Date(utcDate.getTime() + timeZoneShift)
}

// following for proper time conversion

// this is time converted to UTC, need to then add timezone for place searched
