
let latitude = ''
let longitude = ''

async function getCurrentWeather () {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial&appid=c48bcffd61ca0ded777af3c42746942e`, { mode: 'cors' })
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
  return { temp, feelsLike, humidity, wind, description, iconUrl }
}
function createIconUrl (iconKey) {
  return `http://openweathermap.org/img/wn/${iconKey}@4x.png`
}

async function getWeatherForecast () {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=imperial&appid=c48bcffd61ca0ded777af3c42746942e`, { mode: 'cors' })
    const weatherForecastObject = await response.json()
    return weatherForecastObject
  } catch (error) {
    console.error('error: ', error)
    alert(error)
  }
}

export const setLocation = (lat, lon) => {
  latitude = lat
  longitude = lon
}

export const retrieveForecastData = async (lat, lon) => {
  if (lat && lon) {
    latitude = lat
    longitude = lon
  }
  const currentWeatherObject = await getCurrentWeather()
  const weatherForecastObject = await getWeatherForecast()
  return [currentWeatherObject, weatherForecastObject]
}
