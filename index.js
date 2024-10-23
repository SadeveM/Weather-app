const apiKey = "059dd9cbf6a5c909bc31c50265fc6f75";
const geocodingAPI = "http://api.openweathermap.org/geo/1.0/direct?";
const weatherAPI = "https://api.openweathermap.org/data/2.5/weather?";

async function getLatLon(city) {
    const response = await fetch(geocodingAPI + `q=${city}&appid=${apiKey}`)
    .then((result) => {
        return result.json();
    })
    .then((result) => {
        latitude = result[0].lat;
        longitude = result[0].lon;
        getWeather(latitude, longitude)
    });
}

async function getWeather(latitude, longitude) {
    let data;

    console.log(latitude)
    const response = await fetch(weatherAPI + `lat=${latitude}&lon=${longitude}&appid=${apiKey}`)
    .then((result) => {
        return result.json()
    })
    .then((result) => {
        data = result
    })
    console.log(data)
}

getLatLon("london")