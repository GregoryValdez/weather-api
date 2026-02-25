const header = document.createElement('h1');
header.textContent = 'Intro';
document.body.append(header);

async function getWeather() {
    try {
        let response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m,weather_code&timezone=America%2FLos_Angeles&wind_speed_unit=mph&temperature_unit=fahrenheit&precipitation_unit=inch');
        let data = await response.json();
        console.log(data.current.time, data.current.temperature_2m, data.current.weather_code);
        let weather = {
            time: data.current.time,
            temperature: data.current.temperature_2m,
            condition: data.current.weather_code
        }
        const weatherHeader = document.createElement('h2');
        weatherHeader.textContent = 'Current Weather';
        document.body.append(weatherHeader);
        const weatherInfo = document.createElement('p');
        weatherInfo.innerHTML = `Date/Time: ${weather.time} <br> Temperature: ${weather.temperature}°F <br>
        Condition Code: ${weather.condition} corresponds to sandstorm, duststorm, or blowing snow/drifting snow.`;
        document.body.append(weatherInfo);
        return weather;
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

getWeather();