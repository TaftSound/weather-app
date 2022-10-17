let timeZone

function interpretEachDayData (dataObject) {
  const dayOrNight = dataObject[0][0].sys.pod
  console.log(dayOrNight)
  for (const day in dataObject) {
    let needIcon = true
    const currentDayArray = dataObject[day]
    for (let j = 0; j < currentDayArray.length; j++) {
      const currentReport = currentDayArray[j]
      let iconUrl = false
      if (needIcon) {
        if (currentReport.sys.pod === dayOrNight) {
          iconUrl = createIconUrl(currentReport.weather[0].icon)
          needIcon = false
        }
      }
      const temp = currentReport.main.temp
      const humidity = currentReport.main.humidity
      const wind = currentReport.wind.speed
      const precipitation = currentReport.pop
      currentDayArray[j] = { temp, humidity, wind, precipitation, iconUrl }
    }
  }
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
  interpretEachDayData(fiveDayData)
  console.log(fiveDayData)
  return fiveDayData
}
