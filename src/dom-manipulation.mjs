const currentWeatherIcon = document.getElementById('current-weather-icon')
const currentTemp = document.getElementById('current-temperature')
const feelsLike = document.getElementById('feels-like')
const currentHumidity = document.getElementById('current-humidity')
const currentWind = document.getElementById('current-wind')
const currentWeatherDescription = document.getElementById('weather-description')

const currentLocation = document.getElementById('location')
const currentDate = document.getElementById('date')
const dayTwo = document.getElementById('day-two').firstElementChild
const dayThree = document.getElementById('day-three').firstElementChild
const dayFour = document.getElementById('day-four').firstElementChild
const dayFive = document.getElementById('day-five').firstElementChild
const daySix = document.getElementById('day-six').firstElementChild

const searchInput = document.getElementById('search')

export function getSearchValue () {
  let searchValue = searchInput.value
  searchValue = searchValue.replace(/\s+/g, '')
  searchInput.value = ''
  const searchValueArray = searchValue.split(',')
  searchValue = searchValueArray[0]
  if (searchValueArray[1]) { searchValue += ',' + searchValueArray[1] + ',' }
  if (searchValueArray[2]) { searchValue += searchValueArray[2] }
  return searchValue
}

export function displayCurrentWeather (weatherObject) {
  currentTemp.textContent = `${weatherObject.temp}`
  feelsLike.textContent = `Feels like: ${weatherObject.feelsLike}°`
  currentHumidity.textContent = `Humidity: ${weatherObject.humidity}%`
  currentWind.textContent = `Wind: ${weatherObject.wind} mph`
  currentWeatherDescription.textContent = capFirstLetter(weatherObject.description)
  currentWeatherIcon.src = weatherObject.iconUrl
}

export function displayCurrentLocation (locationName) {
  currentLocation.textContent = locationName
}
export function displayDays (dateString, upcomingDaysArray) {
  currentDate.textContent = dateString
  dayTwo.textContent = upcomingDaysArray[0]
  dayThree.textContent = upcomingDaysArray[1]
  dayFour.textContent = upcomingDaysArray[2]
  dayFive.textContent = upcomingDaysArray[3]
  daySix.textContent = upcomingDaysArray[4]
}

function capFirstLetter (string) {
  return string[0].toUpperCase() + string.slice(1)
}
