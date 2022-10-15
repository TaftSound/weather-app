import format from 'date-fns/format/index.js'

let currentDate
let timeZone

async function getCurrentWeather (lat, lon) {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=c48bcffd61ca0ded777af3c42746942e`, { mode: 'cors' })
    const currentWeatherObject = await response.json()
    return processCurrentWeatherData(currentWeatherObject)
  } catch (error) {
    console.error('error: ', error)
    alert(error)
  }
}
function processCurrentWeatherData (dataObject) {
  const temp = Math.round(dataObject.main.temp)
  const feelsLike = Math.round(dataObject.main.feels_like)
  const humidity = Math.round(dataObject.main.humidity)
  const wind = Math.round(dataObject.wind.speed)
  const description = dataObject.weather[0].description
  const iconUrl = createIconUrl(dataObject.weather[0].icon)
  const localeDate = dataObject.dt
  timeZone = dataObject.timezone
  currentDate = normalizeDate(localeDate)
  console.log(currentDate)
  return { temp, feelsLike, humidity, wind, description, iconUrl, localeDate }
}
// function processUpcomingWeatherData (dataObject) {
//   let dateKey = currentDate
//   let dayNumber = 0
//   const fiveDayData = {}
//   const twentyFourHourData = []
//   fiveDayData[dayNumber] = []
//   for (let i = 0; i < 40; i++) {
//     const currentReport = dataObject.list[i]
//     const currentReportDate = normalizeDate(currentReport.dt)
//     if (i < 8) {
//       const processedReport = interpretOneDayData(currentReport)
//       twentyFourHourData.push(processedReport)
//     }
//     if (currentReportDate === currentDate) { continue }
//     if (currentReportDate !== dateKey) {
//       dateKey = currentReportDate
//       dayNumber++
//       fiveDayData[dayNumber] = []
//     }
//     fiveDayData[dayNumber].push(currentReport)
//   }
//   console.log(twentyFourHourData, fiveDayData)
//   return { twentyFourHourData, fiveDayData }
// }
function processFiveDayData (dataObject) {
  let dateKey = currentDate
  let dayNumber = -1
  const fiveDayData = {}
  for (let i = 0; i < 40; i++) {
    const currentReport = dataObject.list[i]
    const currentReportDate = normalizeDate(currentReport.dt)
    if (currentReportDate === currentDate) { continue }
    if (currentReportDate !== dateKey) {
      dateKey = currentReportDate
      dayNumber++
      fiveDayData[dayNumber] = []
    }
    fiveDayData[dayNumber].push(currentReport)
  }
  console.log(fiveDayData)
  return fiveDayData
}
// interpretFiveDayData (dataObject) {

// }
function processOneDayData (dataObject) {
  const oneDayData = []
  for (let i = 0; i < 8; i++) {
    const currentReport = dataObject.list[i]
    const processedReport = interpretOneDayData(currentReport)
    oneDayData.push(processedReport)
  }
  console.log(oneDayData)
  return oneDayData
}
function interpretOneDayData (dataObject) {
  const temp = dataObject.main.temp
  const humidity = dataObject.main.humidity
  const wind = dataObject.wind.speed
  return { temp, humidity, wind }
}
function createIconUrl (iconKey) {
  return `http://openweathermap.org/img/wn/${iconKey}@4x.png`
}
function normalizeDate (dateValue) {
  let localeTime = new Date((dateValue + timeZone) * 1000).toUTCString()
  localeTime = localeTime.split(',')
  return localeTime[0]
}

async function getWeatherForecast (lat, lon) {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=c48bcffd61ca0ded777af3c42746942e`, { mode: 'cors' })
    const weatherForecastObject = await response.json()
    const oneDayData = processOneDayData(weatherForecastObject)
    const fiveDayData = processFiveDayData(weatherForecastObject)
    return { oneDayData, fiveDayData }
  } catch (error) {
    console.error('error: ', error)
    alert(error)
  }
}

export const retrieveForecastData = async (lat, lon) => {
  const currentWeatherObject = await getCurrentWeather(lat, lon)
  const weatherForecastObject = await getWeatherForecast(lat, lon)
  return [currentWeatherObject, weatherForecastObject]
}
