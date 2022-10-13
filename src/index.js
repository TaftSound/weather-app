import { retrieveForecastData, setLocation } from './forecast-data.mjs'
import { setCurrentWeather, getSearchValue } from './dom-manipulation.mjs'
import { searchForLocation, getLocationName } from './geocoding.mjs'

let currentWeatherObject
let weatherForecastObject

getUserWeather()
listenForPermissionsChange()
listenForSearchInput()
// setCurrentWeather()

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
      const searchValue = getSearchValue(searchInput)
      const latAndLong = await searchForLocation(searchValue)
      getWeatherForecast(latAndLong[0], latAndLong[1])
    }
  })
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

async function getWeatherForecast (lat, lon) {
  try {
    const result = await retrieveForecastData(lat, lon)
    currentWeatherObject = result[0]
    weatherForecastObject = result[1]
    setCurrentWeather(
      currentWeatherObject.temp,
      currentWeatherObject.feelsLike,
      currentWeatherObject.humidity,
      currentWeatherObject.wind,
      currentWeatherObject.description,
      currentWeatherObject.iconUrl
    )
    console.log(currentWeatherObject)
    console.log(weatherForecastObject)
  } catch (error) {
    return error
  }
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

function requestGeolocation () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject)
  })
}
