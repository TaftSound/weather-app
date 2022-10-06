import retrieveForecastData from './forecast-data.mjs'

const searchInput = document.querySelector('input')
let currentWeatherObject
let weatherForecastObject

searchInput.addEventListener('keypress', async (event) => {
  if (event.key === 'Enter') {
    event.preventDefault()
    const result = await retrieveForecastData(searchInput)
    currentWeatherObject = result[0]
    weatherForecastObject = result[1]
    console.log(currentWeatherObject)
    console.log(weatherForecastObject)
  }
})
