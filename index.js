const apiKey = "059dd9cbf6a5c909bc31c50265fc6f75";
const geocodingAPI = "https://api.openweathermap.org/geo/1.0/direct?";
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

// Add loading indicator
const loadingIndicator = document.createElement('div');
loadingIndicator.className = 'loading-spinner';
loadingIndicator.style.display = 'none';
document.querySelector('.weather-app').appendChild(loadingIndicator);

// Debounce function to prevent too many API calls
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

async function getLatLon(city) {
    if (!city.trim()) {
        errorMsg.textContent = "Please enter a city name";
        errorMsg.style.display = "block";
        interface.style.display = "none";
        return;
    }

    loadingIndicator.style.display = 'block';
    interface.style.display = "none";
    errorMsg.style.display = "none";

    try {
        const response = await fetch(geocodingAPI + `q=${encodeURIComponent(city)}&appid=${apiKey}`);
        const result = await response.json();
        
        if (!result.length) {
            throw new Error('City not found');
        }

        const { lat: latitude, lon: longitude } = result[0];
        await getWeather(latitude, longitude);
    } catch (err) {
        errorMsg.textContent = "City not found. Please try again.";
        errorMsg.style.display = "block";
    } finally {
        loadingIndicator.style.display = 'none';
    }
}

async function getWeather(latitude, longitude) {
    try {
        const response = await fetch(weatherAPI + `lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`);
        const data = await response.json();
        
        temperature.innerHTML = `${Math.round(data.main.temp)}°C`;
        cityName.innerHTML = data.name;
        humidty.innerHTML = `${data.main.humidity}%`;
        wind.innerHTML = `${((data.wind.speed * 3600)/1000).toFixed(1)} km/h`;
        weatherImg.src = `images/${data.weather[0].main.toLowerCase()}.png`;
        weatherImg.alt = data.weather[0].description;

        interface.style.display = "flex";
    } catch (err) {
        errorMsg.textContent = "Failed to fetch weather data. Please try again.";
        errorMsg.style.display = "block";
    }
}

// Debounced search handler
const debouncedSearch = debounce((value) => getLatLon(value), 500);

// Event listeners
searchButton.addEventListener("click", () => getLatLon(inputBox.value));
inputBox.addEventListener("input", (e) => debouncedSearch(e.target.value));
inputBox.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        getLatLon(inputBox.value);
    }
});
