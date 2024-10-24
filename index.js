const apiKey = "059dd9cbf6a5c909bc31c50265fc6f75";
const geocodingAPI = "http://api.openweathermap.org/geo/1.0/direct?";
const weatherAPI = "https://api.openweathermap.org/data/2.5/weather?";

const interface = document.querySelector(".weather");
const inputBox = document.querySelector(".input-box");
const searchButton = document.querySelector(".search-btn")
const temperature = document.querySelector(".temperature");
const cityName = document.querySelector(".city-name");
const humidty = document.querySelector(".humidity-value");
const wind = document.querySelector(".wind-value");
const weatherImg = document.querySelector(".weather-img")
const errorMsg = document.querySelector(".error")

async function getLatLon(city) {
    const response = await fetch(geocodingAPI + `q=${city}&appid=${apiKey}`)
    .then((result) => {
        return result.json();
    })
    .then((result) => {
        try {
            latitude = result[0].lat;
            longitude = result[0].lon;
            errorMsg.style.display = "none";
            getWeather(latitude, longitude);
        } 
        catch (err) {
            interface.style.display = "none";
            errorMsg.style.display = "block";
        }
    });
}

async function getWeather(latitude, longitude) {
    let data;

    console.log(latitude)
    const response = await fetch(weatherAPI + `lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`)
    .then((result) => {
        return result.json()
    })
    .then((result) => {
        data = result
    })
    console.log(data)
    temperature.innerHTML = Math.round(data.main.temp) + "°C";
    cityName.innerHTML = data.name;
    humidty.innerHTML = data.main.humidity + "%";
    wind.innerHTML = ((data.wind.speed * 3600)/1000).toFixed(2)+ "km/h";
    weatherImg.src = `images/${(data.weather[0].main).toLowerCase()}.png`;

    interface.style.display = "flex";
}

searchButton.addEventListener("click", () => {
    getLatLon(inputBox.value);
})

inputBox.addEventListener("keydown", (event) => {
    if(event.key == "Enter")
        getLatLon(inputBox.value)
})
