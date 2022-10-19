let timeZone

function interpretData (dataObject) {
  const dayOrNight = dataObject[0][0].sys.pod
  console.log(dayOrNight)
  const firstDayLength = dataObject[0].length
  const fiveDayData = []
  const graphData = []
  for (let i = 0; i < 6; i++) {
    let needIcon = true
    const currentDayArray = dataObject[i]
    let highTemp = 0
    let lowTemp = 1000
    let iconUrl = false
    for (let j = 0; j < currentDayArray.length; j++) {
      const currentReport = currentDayArray[j]
      if (needIcon) {
        if (currentReport.sys.pod === dayOrNight) {
          iconUrl = createIconUrl(currentReport.weather[0].icon)
          needIcon = false
        }
      }
      if (currentReport.main.temp > highTemp) { highTemp = currentReport.main.temp }
      if (currentReport.main.temp < lowTemp) { lowTemp = currentReport.main.temp }
      const temp = currentReport.main.temp
      const wind = currentReport.wind.speed
      const precipitation = currentReport.pop
      graphData.push({ temp, wind, precipitation })
    }
    if (i === 5) { continue }
    fiveDayData[i] = { highTemp, lowTemp, iconUrl }
  }
  return { fiveDayData, graphData, firstDayLength }
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
