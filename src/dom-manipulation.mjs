const currentWeatherIcon = document.getElementById('current-weather-icon')
const currentTemp = document.getElementById('current-temperature')
const feelsLike = document.getElementById('feels-like')
const currentHumidity = document.getElementById('current-humidity')
const currentWind = document.getElementById('current-wind')
const currentWeatherDescription = document.getElementById('weather-description')

export function getSearchValue (inputElement) {
  let searchValue = inputElement.value
  searchValue = searchValue.replace(/\s+/g, '')
  inputElement.value = ''
  const searchValueArray = searchValue.split(',')
  searchValue = searchValueArray[0]
  if (searchValueArray[1]) { searchValue += ',' + searchValueArray[1] + ',' }
  if (searchValueArray[2]) { searchValue += searchValueArray[2] }
  return searchValue
}

export function setCurrentWeather (temp, feelTemp, humidity, wind, description, iconUrl) {
  currentTemp.textContent = `${temp}`
  feelsLike.textContent = `Feels like: ${feelTemp}°`
  currentHumidity.textContent = `Humidity: ${humidity}%`
  currentWind.textContent = `Wind: ${wind} mph`
  currentWeatherDescription.textContent = capFirstLetter(description)
  currentWeatherIcon.src = iconUrl
}

function capFirstLetter (string) {
  return string[0].toUpperCase() + string.slice(1)
}
