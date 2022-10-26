const currentWeatherIcon = document.getElementById('current-weather-icon')
const currentTemp = document.getElementById('current-temperature')
const feelsLike = document.getElementById('feels-like')
const currentHumidity = document.getElementById('current-humidity')
const currentWind = document.getElementById('current-wind')
const currentWeatherDescription = document.getElementById('weather-description')
const currentLocation = document.getElementById('location')
const currentDate = document.getElementById('date')

const graphLine = document.getElementById('graph-line')
const textPathChildren = document.getElementById('text-container').children
const temperatureButton = document.getElementById('temperature')
const precipButton = document.getElementById('precipitation')
const windButton = document.getElementById('wind')

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
  const dayOneIcon = dayOneDiv.firstElementChild.nextElementSibling.firstElementChild
  currentWeatherIcon.src = weatherObject.iconUrl
  dayOneIcon.src = weatherObject.iconUrl
}
export function displayWeatherForecast (weatherObject) {
  const fiveDayData = weatherObject.fiveDayData
  console.log(fiveDayData)
  console.log(weatherObject)
  for (const day in fiveDayData) {
    const currentDayIcon = dayDivArray[day].firstElementChild.nextElementSibling.firstElementChild
    const currentDayHigh = dayDivArray[day].lastElementChild.firstElementChild
    const currentDayLow = dayDivArray[day].lastElementChild.lastElementChild
    currentDayHigh.textContent = `${Math.round(fiveDayData[day].highTemp)}°`
    currentDayLow.textContent = `${Math.round(fiveDayData[day].lowTemp)}°`
    if (!fiveDayData[day].iconUrl) { continue }
    currentDayIcon.src = fiveDayData[day].iconUrl
  }
}

export function displayForecastGraph (dataObject) {
  displayGraph(dataObject, 'temp', 'tempY')
  temperatureButton.addEventListener('click', () => {
    displayGraph(dataObject, 'temp', 'tempY')
  })
  precipButton.addEventListener('click', () => {
    displayGraph(dataObject, 'precipitation', 'precipY')
  })
  windButton.addEventListener('click', () => {
    displayGraph(dataObject, 'wind', 'windY')
  })
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

function displayGraph (dataObject, propertyName, propertyY) {
  const lineString = createGraphLineString(dataObject.graphData, propertyY)
  placeGraphText(dataObject.graphData, propertyName, propertyY)
  graphLine.setAttribute('d', lineString)

  function createGraphLineString (graphDataObject, propertyName) {
    let lineString = 'M -12.5 125 L -12.5 50'
    for (const point in graphDataObject) {
      const xValue = point * 12.5
      const yValue = 100 - graphDataObject[point][propertyName]
      lineString = lineString + ` L ${xValue} ${yValue}`
    }
    lineString = lineString + ' L 500 125'
    return lineString
  }
  function placeGraphText (graphDataObject, propertyName, propertyY) {
    for (const point in graphDataObject) {
      const xValue = point * 12.5 - 1.5
      const yValue = 93 - graphDataObject[point][propertyY]
      const textValue = Math.round(graphDataObject[point][propertyName])
      textPathChildren[point].setAttribute('x', `${xValue}%`)
      textPathChildren[point].setAttribute('y', `${yValue}%`)
      textPathChildren[point].textContent = textValue
    }
  }
}

function capFirstLetter (string) {
  return string[0].toUpperCase() + string.slice(1)
}
