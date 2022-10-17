
let timeZone

async function getCurrentWeather (lat, lon) {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=c48bcffd61ca0ded777af3c42746942e`, { mode: 'cors' })
    const currentWeatherObject = await response.json()
    return parseCurrentWeatherData(currentWeatherObject)
  } catch (error) {
    console.error('error: ', error)
    alert(error)
  }
}
function parseCurrentWeatherData (dataObject) {
  const temp = Math.round(dataObject.main.temp)
  const feelsLike = Math.round(dataObject.main.feels_like)
  const humidity = Math.round(dataObject.main.humidity)
  const wind = Math.round(dataObject.wind.speed)
  const description = dataObject.weather[0].description
  const iconUrl = createIconUrl(dataObject.weather[0].icon)
  // const localeDate = dataObject.dt
  timeZone = dataObject.timezone
  return { temp, feelsLike, humidity, wind, description, iconUrl, timeZone }
}
async function getWeatherForecast (lat, lon) {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=c48bcffd61ca0ded777af3c42746942e`, { mode: 'cors' })
    const weatherForecastObject = await response.json()
    const fiveDayData = parseWeatherForecastData(weatherForecastObject)
    return { fiveDayData }
  } catch (error) {
    console.error('error: ', error)
    alert(error)
  }
}
function parseWeatherForecastData (dataObject) {
  let dateKey = ''
  let dayNumber = -1
  const days = ['dayOne', 'dayTwo', 'dayThree', 'dayFour', 'dayFive', 'daySix']
  const fiveDayData = {}
  for (let i = 0; i < 40; i++) {
    const currentReport = dataObject.list[i]
    const currentReportDate = normalizeDate(currentReport.dt)
    if (currentReportDate !== dateKey) {
      dateKey = currentReportDate
      dayNumber++
      fiveDayData[days[dayNumber]] = []
    }
    fiveDayData[days[dayNumber]].push(currentReport)
  }
  interpretFiveDayData(fiveDayData)
  return fiveDayData

  function interpretFiveDayData (dataObject) {
    for (const day in dataObject) {
      const currentDayArray = dataObject[day]
      for (let j = 0; j < currentDayArray.length; j++) {
        const currentReport = currentDayArray[j]
        const processedReport = interpretOneDayData(currentReport)
        currentDayArray[j] = processedReport
      }
    }
  }
  function interpretOneDayData (dataObject) {
    const temp = dataObject.main.temp
    const humidity = dataObject.main.humidity
    const wind = dataObject.wind.speed
    const precipitation = dataObject.pop
    return { temp, humidity, wind, precipitation }
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

export const retrieveForecastData = async (lat, lon) => {
  const currentWeatherObject = await getCurrentWeather(lat, lon)
  const weatherForecastObject = await getWeatherForecast(lat, lon)
  return [currentWeatherObject, weatherForecastObject]
}
