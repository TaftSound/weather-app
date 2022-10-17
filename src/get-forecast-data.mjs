import { parseCurrentWeatherData, parseWeatherForecastData } from './interpret-forecast-data.mjs'

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

async function getWeatherForecast (lat, lon) {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=c48bcffd61ca0ded777af3c42746942e`, { mode: 'cors' })
    const weatherForecastObject = await response.json()
    return parseWeatherForecastData(weatherForecastObject)
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
