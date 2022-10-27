const currentWeatherIcon = document.getElementById('current-weather-icon')
const currentTemp = document.getElementById('current-temperature')
const feelsLike = document.getElementById('feels-like')
const currentHumidity = document.getElementById('current-humidity')
const currentWind = document.getElementById('current-wind')
const currentWeatherDescription = document.getElementById('weather-description')
const currentLocation = document.getElementById('location')
const currentDate = document.getElementById('date')

const forecastGraphContainer = document.getElementsByClassName('forecast-graph')[0]
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
  displayDailyForecast(weatherObject.fiveDayData)
  displayForecastGraph(weatherObject)
  addDayButtonListeners(weatherObject)
  moveForecastGraph(0, 0)
  setSelectedDay(0)
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

function addDayButtonListeners (weatherObject) {
  for (const day in dayDivArray) {
    let listenerFunction
    if (!+day) {
      listenerFunction = () => {
        moveForecastGraph(0, 0)
        setSelectedDay(+day)
      }
    } else {
      const dayOneShift = weatherObject.firstDayLength
      const dayNumber = +day
      listenerFunction = () => {
        moveForecastGraph(dayOneShift, dayNumber)
        setSelectedDay(+day)
      }
    }
    dayDivArray[day].addEventListener('click', listenerFunction)
  }
}

function setSelectedDay (dayNumber) {
  for (const day in dayDivArray) {
    dayDivArray[day].className = 'day-forecast-div'
  }
  dayDivArray[dayNumber].className = 'day-forecast-div selected-day'
}

function moveForecastGraph (firstDayLength, dayNumber) {
  const svgArray = [...forecastGraphContainer.children]
  let movePercentage
  if (!firstDayLength) { movePercentage = 6.25 }
  else { movePercentage = -(firstDayLength * 25) + -((dayNumber - 1) * 200) + 12.5 }
  console.log(movePercentage)
  for (const svg in svgArray) {
    svgArray[svg].style.left = `${movePercentage}%`
  }
}

function displayDailyForecast (fiveDayData) {
  for (const day in fiveDayData) {
    const currentDay = dayDivArray[day]
    const currentDayIcon = currentDay.firstElementChild.nextElementSibling.firstElementChild
    const currentDayHigh = currentDay.lastElementChild.firstElementChild
    const currentDayLow = currentDay.lastElementChild.lastElementChild
    currentDayHigh.textContent = `${Math.round(fiveDayData[day].highTemp)}°`
    currentDayLow.textContent = `${Math.round(fiveDayData[day].lowTemp)}°`
    if (!fiveDayData[day].iconUrl) { continue }
    currentDayIcon.src = fiveDayData[day].iconUrl
  }
}

function displayForecastGraph (dataObject) {
  displayGraph(dataObject, 'temp', 'tempY', '°')
  setActiveGraphButton(temperatureButton, '')
  temperatureButton.addEventListener('click', () => {
    displayGraph(dataObject, 'temp', 'tempY', '°')
    setActiveGraphButton(temperatureButton, '')
  })
  precipButton.addEventListener('click', () => {
    displayGraph(dataObject, 'precipitation', 'precipY', '%')
    setActiveGraphButton(precipButton, 'precip-graph')
  })
  windButton.addEventListener('click', () => {
    displayGraph(dataObject, 'wind', 'windY', 'mph')
    setActiveGraphButton(windButton, 'wind-graph')
  })
}

function setActiveGraphButton (button, graphLineClass) {
  temperatureButton.className = ''
  windButton.className = ''
  precipButton.className = ''
  button.className = 'active'
  graphLine.setAttribute('class', graphLineClass)
}

function displayGraph (dataObject, propertyName, propertyY, descriptor) {
  const lineString = createGraphLineString(dataObject.graphData)
  placeGraphText(dataObject.graphData)
  graphLine.setAttribute('d', lineString)

  function createGraphLineString (graphDataObject) {
    let lineString = 'M -12.5 125' + ` L -12.5 ${100 - graphDataObject[0][propertyY]}`
    for (const point in graphDataObject) {
      const xValue = point * 12.5
      const yValue = 100 - graphDataObject[point][propertyY]
      lineString = lineString + ` L ${xValue} ${yValue}`
    }
    lineString = lineString + ' L 500 125'
    return lineString
  }
  function placeGraphText (graphDataObject) {
    for (const point in graphDataObject) {
      const xValue = point * 12.5 - 1.5
      const yValue = 87 - graphDataObject[point][propertyY]
      const textValue = Math.round(graphDataObject[point][propertyName])
      textPathChildren[point].setAttribute('x', `${xValue}%`)
      textPathChildren[point].setAttribute('y', `${yValue}%`)
      textPathChildren[point].textContent = `${textValue}${descriptor}`
    }
  }
}

function capFirstLetter (string) {
  return string[0].toUpperCase() + string.slice(1)
}
