import { retrieveForecastData } from './get-forecast-data.mjs'
import { searchForLocation, getUserLocation, getLocationName, getLat, getLon } from './geocoding.mjs'
import { getCurrentDate, getNextDays, setLocaleDate } from './date-data.mjs'
import {
  displayCurrentWeather,
  displayWeatherForecast,
  displayCurrentLocation,
  displayForecastGraph,
  displayDays,
  getSearchValue
} from './dom-manipulation.mjs'

renderUserLocationWeather()
listenForPermissionsChange()
listenForSearchInput()

async function renderUserLocationWeather () {
  getUserLocation()
    .then(() => renderWeatherForecast())
    .catch((error) => handleError(error))
}

async function renderWeatherForecast () {
  try {
    const weatherObject = await retrieveForecastData(getLat(), getLon())
    const locationName = getLocationName()
    displayCurrentLocation(locationName)
    setLocaleDate(weatherObject[0])
    displayDays(getCurrentDate(), getNextDays())
    displayCurrentWeather(weatherObject[0])
    displayWeatherForecast(weatherObject[1])
  } catch (error) {
    return error
  }
}

function listenForPermissionsChange () {
  navigator.permissions.query({ name: 'geolocation' })
    .then((result) => {
      result.onchange = () => {
        renderUserLocationWeather()
      }
    })
}

function listenForSearchInput () {
  const searchInput = document.querySelector('input')
  searchInput.addEventListener('keypress', async (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      searchForLocation(getSearchValue())
        .then(() => renderWeatherForecast())
        .catch((error) => handleError(error))
    }
  })
}

function handleError (error) {
  if (error.message === 'User denied Geolocation') {
    console.log('User denied geolocation')
  } else {
    alert(error.message)
    console.log(error)
  }
}
