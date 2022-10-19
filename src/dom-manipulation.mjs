const currentWeatherIcon = document.getElementById('current-weather-icon')
const currentTemp = document.getElementById('current-temperature')
const feelsLike = document.getElementById('feels-like')
const currentHumidity = document.getElementById('current-humidity')
const currentWind = document.getElementById('current-wind')
const currentWeatherDescription = document.getElementById('weather-description')
const currentLocation = document.getElementById('location')
const currentDate = document.getElementById('date')

const graphLine = document.getElementById('graph-line')
const dotPathContainer = document.getElementById('dot-path-container')

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
  const fiveDayData = weatherObject.fiveDayData
  console.log(fiveDayData)
  console.log(weatherObject)
  for (const day in fiveDayData) {
    const currentDayIcon = dayDivArray[day].firstElementChild.nextElementSibling.firstElementChild
    const currentDayHigh = dayDivArray[day].lastElementChild.firstElementChild
    const currentDayLow = dayDivArray[day].lastElementChild.lastElementChild
    currentDayIcon.src = fiveDayData[day].iconUrl
    currentDayHigh.textContent = `${Math.round(fiveDayData[day].highTemp)}°`
    currentDayLow.textContent = `${Math.round(fiveDayData[day].lowTemp)}°`
  }
}

export function displayForecastGraph (dataObject) {
  graphLine.setAttribute('d', 'M -12.5 13 L 0 0 L 12.5 2 L 25 50 L 37.5 10 L 50 100 L 62.5 0 L 75 2 L 87.5 50 L 100 10 L 112.5 100')
  const dAttribute = graphLine.getAttribute('d')
  // console.log(dAttribute)
  // console.log(dotPathContainer.children)
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
