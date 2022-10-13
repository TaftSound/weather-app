const currentWeatherIcon = document.getElementById('current-weather-icon')
const currentTemp = document.getElementById('current-temperature')
const feelsLike = document.getElementById('feels-like')
const currentHumidity = document.getElementById('current-humidity')
const currentWind = document.getElementById('current-wind')
const currentWeatherDescription = document.getElementById('weather-description')

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
