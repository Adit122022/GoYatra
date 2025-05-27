const axios = require("axios");

async function getWeather(city) {
  try {
    const apiKey = process.env.WEATHER_API_KEY;
    console.log(apiKey);
    const response = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather",
      {
        params: {
          q: city,
          appid: apiKey,
          units: "metric", // Use "imperial" for Fahrenheit
        },
      }
    );

    const data = response.data;
    return `Current weather in ${data.name}: ${data.weather[0].description}, temperature: ${data.main.temp}°C`;
  } catch (error) {
    console.error("Weather API error:", error.message);
    return "Unable to fetch weather data at the moment.";
  }
}

module.exports = getWeather;