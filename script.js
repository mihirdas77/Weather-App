const form = document.querySelector('form');
const container = document.querySelector('.weather-details');
const input = document.getElementById('input');
const iframe = document.querySelector('iframe');
const forecastContainer = document.querySelector('.forecast-container');

const apiKey = "7f37666b148ef7b26142f7f143f232dc";
const kelvinToCelsius = (tempInKelvin) => (tempInKelvin - 273.15).toFixed(1);

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const city = input.value;
    iframe.src = `https://www.google.com/maps?q=${city}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
    getWeatherData(city);
    getForecast(city);
});

async function getWeatherData(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();
    
    container.innerHTML = `
        <p><span>Temperature:</span> ${kelvinToCelsius(data.main.temp)}°C</p>
        <p><span>Minimum Temperature:</span> ${kelvinToCelsius(data.main.temp_min)}°C</p>
        <p><span>Maximum Temperature:</span> ${kelvinToCelsius(data.main.temp_max)}°C</p>
        <p><span>Wind Speed:</span> ${data.wind.speed} m/s</p>
        <p><span>Cloudiness:</span> ${data.clouds.all}%</p>
        <p><span>Sunrise:</span> ${new Date(data.sys.sunrise * 1000).toLocaleTimeString()}</p>
        <p><span>Sunset:</span> ${new Date(data.sys.sunset * 1000).toLocaleTimeString()}</p>
        <p><span>Pressure:</span> ${data.main.pressure} hPa</p>
        <p><span>Visibility:</span> ${data.visibility} m</p>
        <p><span>UV Index:</span> <span id="uvIndex">Fetching...</span></p>
    `;

    getUVIndex(data.coord.lat, data.coord.lon);
}

async function getUVIndex(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,daily&appid=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();
    document.getElementById('uvIndex').textContent = data.current.uvi;
}

async function getForecast(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();

    let forecastHTML = '';
    const forecastData = data.list.filter((elem, index) => index % 8 === 0);
    forecastData.forEach(item => {
        const iconCode = item.weather[0].icon;
        const iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`;

        forecastHTML += `
            <div class="forecast-item">
                <p>Date: ${new Date(item.dt * 1000).toLocaleDateString()}</p>
                <img src="${iconUrl}" alt="Weather Icon"> 
                <p>Temperature: ${kelvinToCelsius(item.main.temp)}°C</p>
                <p>Weather: ${item.weather[0].description}</p>
            </div>
        `;
    });

    forecastContainer.innerHTML = forecastHTML;
}
