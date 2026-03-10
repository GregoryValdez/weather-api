const formatTime = (isoString) => {
    return new Date(isoString).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true 
    });
}

const weatherConfiguration = {
    0: ["☀️", "Clear Sky - No clouds are observed or observable."],
    1: ["🌤️", "Mainly Clear - Clouds are generally dissolving, becoming less developed, or only a few clouds are present."],
    2: ["⛅", "Partly Cloudy - The state of the sky is generally unchanged, with moderate cloud cover (scattered clouds)."],
    3: ["☁️", "Overcast - The sky is covered or clouds are generally forming/developing."],
    45: ["🌫️", "Fog (or Haze) - Visibility is reduced by smoke, dust, or haze."],
    48: ["🌫️", "Fog (or Haze) - Visibility is reduced by smoke, dust, or haze."],
}

const firstDisplay = document.getElementById('image');
const welcomeMessage = document.createElement('p');
welcomeMessage.textContent = 'Welcome to the Michael Valdez Weather App! Click on the links above to view the current weather or a 7 day forecast for the City of Stockton.';
welcomeMessage.style.color = '#FFF';
firstDisplay.appendChild(welcomeMessage);
const img = document.createElement('img');
img.src = 'https://c8.alamy.com/comp/2C372JT/california-red-highlighted-in-map-of-the-united-states-of-america-2C372JT.jpg';
img.alt = 'California on a map of the United States';
img.style.width = '100%';
img.style.height = 'auto';
firstDisplay.appendChild(img);

async function getCurrentWeather() {
    try {
        let response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=38.0022&longitude=-121.3362&current=temperature_2m,weather_code,wind_speed_10m,precipitation&timezone=auto&wind_speed_unit=mph&temperature_unit=fahrenheit&precipitation_unit=inch');
        let data = await response.json();
        console.log(data.current.time, data.current.temperature_2m, data.current.wind_speed_10m, data.current.precipitation, data.current.weather_code);
        let weather = {
            time: data.current.time,
            temperature: data.current.temperature_2m,
            wind: data.current.wind_speed_10m,
            precipitation: data.current.precipitation,
            condition: data.current.weather_code
        }

        const currentSection = document.getElementById('current');
        currentSection.innerHTML = ''; 
        const weatherHeader = document.createElement('h2');
        weatherHeader.textContent = 'Current Weather';
        currentSection.appendChild(weatherHeader);
        const weatherInfo = document.createElement('p');
        const time12h = formatTime(weather.time);
        const [date] = weather.time.split('T'); 
        const code = weather.condition;
        const [emoji, text] = weatherConfiguration[code] || ['❓', 'Unknown Weather Condition']; 

        weatherInfo.innerHTML = `<strong>📅 Date/🕰️ PDT:</strong> ${date} ${time12h}<br> <strong>🌡️ Temperature:</strong> ${weather.temperature}°F<br> <strong>🍃 Wind Speed:</strong> ${weather.wind} mph<br> <strong>🌧️ Precipitation:</strong> ${weather.precipitation} inches<br> <strong> Condition:</strong> ${emoji} ${text}`;

        currentSection.appendChild(weatherInfo);
        return weather;
    } catch (error) {
        // console.error('Error fetching current weather:', error);
        alert('Error fetching current weather. Please try again!');
    }
}

async function get7DayForecast() {
    try {
        let response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=38.0022&longitude=-121.3362&daily=weather_code,uv_index_max,sunrise,sunset,temperature_2m_max,temperature_2m_min,wind_speed_10m_max,precipitation_probability_max&timezone=auto&wind_speed_unit=mph&temperature_unit=fahrenheit&precipitation_unit=inch');
        let data = await response.json();
        console.log(data.daily.time, data.daily.weather_code, data.daily.uv_index_max, data.daily.sunrise, data.daily.sunset, data.daily.temperature_2m_max, data.daily.temperature_2m_min, data.daily.wind_speed_10m_max, data.daily.precipitation_probability_max);
        let weather = {
            day: data.daily.time,
            condition: data.daily.weather_code,
            uvIndex: data.daily.uv_index_max,
            sunRise: data.daily.sunrise,
            sunSet: data.daily.sunset,
            temperature: data.daily.temperature_2m_max,
            temperature1: data.daily.temperature_2m_min,
            wind: data.daily.wind_speed_10m_max,
            precipitation: data.daily.precipitation_probability_max
        }

        const forecastSection = document.getElementById('forecast');
        forecastSection.innerHTML = ''; 
        const forecastHeader = document.createElement('h2');
        forecastHeader.textContent = '7 Day Forecast';
        forecastSection.appendChild(forecastHeader);

        for (let i = 0; i < 7; i++) { 
            const dailyDiv = document.createElement('div');
            dailyDiv.className = 'daily-forecast';
            const code = weather.condition[i]; 
            const [emoji, text] = weatherConfiguration[code] || ['❓', 'Unknown Weather Condition'];
            const date = weather.day[i];
            const sunrise = formatTime(weather.sunRise[i]);
            const sunset = formatTime(weather.sunSet[i]);
            const tempMax = weather.temperature[i];
            const tempMin = weather.temperature1[i];
            const uv = weather.uvIndex[i];
            const wind = weather.wind[i];
            const precipitation = weather.precipitation[i];

            dailyDiv.innerHTML = `
            <div> <strong>📅 ${date}</strong><br> <strong>🌅 Sunrise:</strong> ${sunrise} | <strong>🌑 Sunset:</strong> ${sunset}<br> <strong>🌡️ High:</strong> ${tempMax}°F | <strong>Low:</strong> ${tempMin}°F<br> <strong>🌞 UV Index:</strong> ${uv}<br> <strong>🍃 Wind Speed:</strong> ${wind} mph<br> <strong>🌧️ Precipitation Probability:</strong> ${precipitation}%<br> <strong>Condition:</strong> ${emoji} ${text}</div> 
            `;
            forecastSection.appendChild(dailyDiv);
        }

        return weather;
    } catch (error) {
        // console.error('Error fetching 7 day forecast:', error);
        alert('Error fetching 7 day forecast. Please try again!');
    }
}

const currentLink = document.querySelector('.current');
const currentSection = document.getElementById('current');
const forecastLink = document.querySelector('.forecast');
const forecastSection = document.getElementById('forecast');

currentLink.addEventListener('click', () => {
    firstDisplay.style.display = 'none';
    forecastSection.style.display = 'none';
    currentSection.style.display = 'block';
    getCurrentWeather();
});

forecastLink.addEventListener('click', () => {
    firstDisplay.style.display = 'none';
    currentSection.style.display = 'none';
    forecastSection.style.display = 'block';
    get7DayForecast();
});