const currentWeatherIcon = document.getElementById('current-weather-icon')
const currentTemp = document.getElementById('current-temperature')
const feelsLike = document.getElementById('feels-like')
const currentHumidity = document.getElementById('current-humidity')
const currentWind = document.getElementById('current-wind')
const currentWeatherDescription = document.getElementById('weather-description')

const currentLocation = document.getElementById('location')
const currentDate = document.getElementById('date')
const dayOneDiv = document.getElementById('day-one')
const dayTwoDiv = document.getElementById('day-two')
const dayThreeDiv = document.getElementById('day-three')
const dayFourDiv = document.getElementById('day-four')
const dayFiveDiv = document.getElementById('day-five')
const dayDivArray = [dayOneDiv, dayTwoDiv, dayThreeDiv, dayFourDiv, dayFiveDiv]

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
export function displayWeatherForecast (weatherObject) {
  for (let i = 0; i < 5; i++) {
    let highNumber = 0
    let lowNumber = 1000
    const currentDayData = weatherObject[i]
    const currentDayIcon = dayDivArray[i].firstElementChild.nextElementSibling
    const currentDayHigh = dayDivArray[i].lastElementChild.firstElementChild
    const currentDayLow = dayDivArray[i].lastElementChild.lastElementChild
    for (let j = 0; j < currentDayData.length; j++) {
      if (currentDayData[j].iconUrl) { currentDayIcon.src = currentDayData[j].iconUrl }
      if (currentDayData[j].temp > highNumber) { highNumber = currentDayData[j].temp }
      if (currentDayData[j].temp < lowNumber) { lowNumber = currentDayData[j].temp }
    }
    currentDayHigh.textContent = `${Math.round(highNumber)}°`
    currentDayLow.textContent = `${Math.round(lowNumber)}°`
  }
}

export function displayCurrentLocation (locationName) {
  currentLocation.textContent = locationName
}
export function displayDays (dateString, upcomingDaysArray) {
  currentDate.textContent = dateString
  for (let i = 0; i < 5; i++) {
    dayDivArray[i].firstElementChild.textContent = upcomingDaysArray[i]
  }
}

function capFirstLetter (string) {
  return string[0].toUpperCase() + string.slice(1)
}
