import { retrieveForecastData } from './forecast-data.mjs'
import { displayCurrentWeather, displayCurrentLocation, getSearchValue } from './dom-manipulation.mjs'
import { searchForLocation, getUserLocation, getLocationName, getLat, getLon } from './geocoding.mjs'

// listenForSearchInput()

renderUserLocationWeather()
listenForPermissionsChange()
listenForSearchInput()

async function renderUserLocationWeather () {
  getUserLocation()
    .then(() => renderWeatherForecast())
    .catch((error) => handleError(error))
}

async function renderWeatherForecast () { // lat and lon optional
  try {
    const weatherObject = await retrieveForecastData(getLat(), getLon())
    const locationName = getLocationName()
    displayCurrentLocation(locationName)
    displayCurrentWeather(weatherObject[0])
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
