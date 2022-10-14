let locationName
let latitude
let longitude

async function retrieveLocationObject (searchValue) {
  try {
    const location = await fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${searchValue}&limit=1&appid=c48bcffd61ca0ded777af3c42746942e`,
    { mode: 'cors' }
    )
    return await location.json()
  } catch (error) {
    console.error('Error: ', error)
    return error
  }
}

function formatLocationName (locationObject) {
  if (!locationObject[0].state) {
    locationName = `${locationObject[0].name}, ${locationObject[0].country}`
  } else {
    locationName = `${locationObject[0].name}, ${locationObject[0].state}, ${locationObject[0].country}`
  }
}

async function setUserLocationName () {
  try {
    const location = await fetch(
    `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=c48bcffd61ca0ded777af3c42746942e`,
    { mode: 'cors' }
    )
    const locationObject = await location.json()
    formatLocationName(locationObject)
  } catch (error) {
    return Promise.reject(error)
  }
}

// Exported functions belows ================================================

export const getLat = () => { return latitude }

export const getLon = () => { return longitude }

export function getLocationName () { return locationName }

export async function getUserLocation () {
  try {
    const locationPromise = await new Promise(function (resolve, reject) {
      navigator.geolocation.getCurrentPosition(resolve, reject)
    })
    latitude = locationPromise.coords.latitude
    longitude = locationPromise.coords.longitude
    await setUserLocationName()
    return Promise.resolve()
  } catch (error) {
    return Promise.reject(error)
  }
}

export async function searchForLocation (searchValue) {
  try {
    const locationObject = await retrieveLocationObject(searchValue)
    formatLocationName(locationObject)
    latitude = locationObject[0].lat
    longitude = locationObject[0].lon
    return Promise.resolve()
  } catch (error) {
    alert('Please enter a valid location')
    console.error('error: ', error)
  }
}
