let timeZone

function interpretData (dataObject) {
  let firstDayLength = dataObject[0].length
  if (firstDayLength === 8) { firstDayLength = 0 }
  const fiveDayData = interpretFiveDayData(dataObject)
  const graphData = interpretGraphData(dataObject, fiveDayData)
  return { fiveDayData, graphData, firstDayLength }
}
function interpretGraphData (dataObject, fiveDayData) {
  const graphData = []
  const minMaxQuotients = getMinMaxQuotients(dataObject, fiveDayData)
  for (const day in dataObject) {
    for (const time in dataObject[day]) {
      const temp = dataObject[day][time].main.temp
      const wind = dataObject[day][time].wind.speed
      const precipitation = dataObject[day][time].pop * 100
      const precipY = (precipitation / 10) * 9
      const tempY = (temp - minMaxQuotients.lowTemp) * minMaxQuotients.tempQuotient
      const windY = (wind - minMaxQuotients.lowWind) * minMaxQuotients.windQuotient
      graphData.push({ temp, wind, precipitation, tempY, windY, precipY })
    }
  }
  return graphData
}
function getMinMaxQuotients (dataObject, fiveDayData) {
  let highTemp = 0
  let lowTemp = 1000
  let highWind = 0
  let lowWind = 1000
  for (const day in fiveDayData) {
    if (fiveDayData[day].highTemp > highTemp) { highTemp = fiveDayData[day].highTemp }
    if (fiveDayData[day].lowTemp < lowTemp) { lowTemp = fiveDayData[day].lowTemp }
  }
  for (const day in dataObject) {
    for (const time in dataObject[day]) {
      if (dataObject[day][time].wind.speed > highWind) { highWind = dataObject[day][time].wind.speed }
      if (dataObject[day][time].wind.speed < lowWind) { lowWind = dataObject[day][time].wind.speed }
    }
  }
  const tempDifference = highTemp - lowTemp
  const windDifference = highWind - lowWind
  const tempQuotient = 90 / tempDifference
  const windQuotient = 90 / windDifference
  return { tempQuotient, windQuotient, lowTemp, lowWind }
}
function interpretFiveDayData (dataObject) {
  const fiveDayData = []
  for (const day in dataObject) {
    if (+day === 5) { continue }
    let highTemp = 0
    let lowTemp = 1000
    let iconUrl = false
    for (const time in dataObject[day]) {
      const currentReport = dataObject[day][time]
      if (currentReport.main.temp > highTemp) { highTemp = currentReport.main.temp }
      if (currentReport.main.temp < lowTemp) { lowTemp = currentReport.main.temp }
      if (+day === 0) { continue }
      if (!iconUrl) { iconUrl = getIconUrl(currentReport) }
    }
    fiveDayData[day] = { highTemp, lowTemp, iconUrl }
  }
  return fiveDayData
}

function getIconUrl (currentReport) {
  if (currentReport.sys.pod === 'd') {
    return createIconUrl(currentReport.weather[0].icon)
  }
  return false
}

function createIconUrl (iconKey) {
  return `http://openweathermap.org/img/wn/${iconKey}@4x.png`
}
function normalizeDate (dateValue) {
  let localeTime = new Date((dateValue + timeZone) * 1000).toUTCString()
  localeTime = localeTime.split(',')
  return localeTime[0]
}

export function parseCurrentWeatherData (dataObject) {
  const temp = Math.round(dataObject.main.temp)
  const feelsLike = Math.round(dataObject.main.feels_like)
  const humidity = Math.round(dataObject.main.humidity)
  const wind = Math.round(dataObject.wind.speed)
  const description = dataObject.weather[0].description
  const iconUrl = createIconUrl(dataObject.weather[0].icon)
  timeZone = dataObject.timezone
  return { temp, feelsLike, humidity, wind, description, iconUrl, timeZone }
}

export function parseWeatherForecastData (dataObject) {
  let dateKey = ''
  let dayNumber = -1
  const fiveDayData = []
  for (let i = 0; i < 40; i++) {
    const currentReport = dataObject.list[i]
    const currentReportDate = normalizeDate(currentReport.dt)
    if (currentReportDate !== dateKey) {
      dateKey = currentReportDate
      dayNumber++
      fiveDayData[dayNumber] = []
    }
    fiveDayData[dayNumber].push(currentReport)
  }
  return interpretData(fiveDayData)
}
