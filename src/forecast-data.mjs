let searchValue = ''
let latitude = ''
let longitude = ''
let locationName = ''

function getFormValue (inputElement) {
  searchValue = inputElement.value
  searchValue = searchValue.replace(/\s+/g, '')
  inputElement.value = ''
  const searchValueArray = searchValue.split(',')
  searchValue = searchValueArray[0]
  if (searchValueArray[1]) { searchValue += ',' + searchValueArray[1] + ',' }
  if (searchValueArray[2]) { searchValue += searchValueArray[2] }
}

async function getPreciseLocation () {
  try {
    const location = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${searchValue}&limit=1&appid=c48bcffd61ca0ded777af3c42746942e`,
      { mode: 'cors' }
    )
    const locationObject = await location.json()
    console.log(locationObject)
    locationName = `${locationObject[0].name}, ${locationObject[0].state}, ${locationObject[0].country}`
    console.log(locationName)
    latitude = locationObject[0].lat
    longitude = locationObject[0].lon
  } catch (error) {
    alert('Please enter a valid location')
    console.error('error: ', error)
  }
}
async function getCurrentWeather () {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial&appid=c48bcffd61ca0ded777af3c42746942e`, { mode: 'cors' })
    const currentWeatherObject = await response.json()
    return currentWeatherObject
  } catch (error) {
    console.error('error: ', error)
    alert(error)
  }
}
async function getWeatherForecast () {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=imperial&appid=c48bcffd61ca0ded777af3c42746942e`, { mode: 'cors' })
    const weatherForecastObject = await response.json()
    return weatherForecastObject
  } catch (error) {
    console.error('error: ', error)
    alert(error)
  }
}

export const setLocation = (lat, lon) => {
  latitude = lat
  longitude = lon
}

export const retrieveForecastData = async (inputElement) => {
  if (inputElement) {
    getFormValue(inputElement)
    await getPreciseLocation()
  }
  const currentWeatherObject = await getCurrentWeather()
  const weatherForecastObject = await getWeatherForecast()
  return [currentWeatherObject, weatherForecastObject]
}
