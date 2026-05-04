function isWeatherQuery(message) {
  const weatherKeywords = /weather|temperature|forecast|raining|sunny|humid|wind/i;
  return weatherKeywords.test(message);
}
function extractLocation(message) {
  const match = message.match(/weather\s+in\s+([a-zA-Z\s]+)/i);
  return match ? match[1].trim() : null;
}
async function fetchWeather(location) {
  const apiKey = process.env.WEATHER_API_KEY;
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + location + "&appid=" + apiKey + "&units=imperial";
  const res = await fetch(url);
  const data = await res.json();
  if (data.cod !== 200) return { error: 'Location not found' };
  return {
    temperature: data.main.temp,
    conditions: data.weather[0].description,
    humidity: data.main.humidity,
    wind: data.wind.speed
  };
}
module.exports = { isWeatherQuery, extractLocation, fetchWeather };
