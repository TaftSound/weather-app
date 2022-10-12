import { retrieveForecastData, setLocation } from './forecast-data.mjs'

let currentWeatherObject
let weatherForecastObject

getUserWeather()
listenForPermissionsChange()
listenForSearchInput()

async function getWeatherForecast (searchInput) {
  const result = await retrieveForecastData(searchInput)
  currentWeatherObject = result[0]
  weatherForecastObject = result[1]
  console.log(currentWeatherObject)
  console.log(weatherForecastObject)
}

async function getUserLocation () {
  try {
    const positionPromise = await requestGeolocation()
    const latitude = positionPromise.coords.latitude
    const longitude = positionPromise.coords.longitude
    setLocation(latitude, longitude)
    return
  } catch (error) {
    return Promise.reject(error)
  }
}

function getUserWeather () {
  getUserLocation()
    .then(() => { getWeatherForecast() })
    .catch((error) => { handleError(error) })
}

function handleError (error) {
  if (error.message === 'User denied Geolocation') {
    console.log('User denied geolocation')
  } else {
    alert(error.message)
    console.log(error)
  }
}

function requestGeolocation () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject)
  })
}

function listenForPermissionsChange () {
  navigator.permissions.query({ name: 'geolocation' })
    .then((result) => {
      result.onchange = () => {
        getUserWeather()
      }
    })
}

function listenForSearchInput () {
  const searchInput = document.querySelector('input')
  searchInput.addEventListener('keypress', async (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      getWeatherForecast(searchInput)
    }
  })
}
