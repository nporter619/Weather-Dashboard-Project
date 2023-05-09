/**
 * Function to fetch coordinates based on city name
 * 
 * @param String - city to seach
 * @returns JSON - The current weather information and coordinated required to get the forecast
 */
async function fetchCoordinates(city) {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${config.openWeatherApiKey}&units=imperial`);
  const data = await response.json();

  console.log('Coordinates data:', data); // Log the coordinates data

  return data;
}

/**
* Function to fetch the 5-day weather forecast based on coordinates
* 
* @param Long lat 
* @param Long lon 
* @returns Array - The filtered weather forcast
*/
async function fetchWeatherForecast(lat, lon) {
  // Use units=imperial for Fahrenheit
  const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${config.openWeatherApiKey}&units=imperial`);
  const data = await response.json();

  // Filter the forecast data to include only one entry per day
  const filteredData = data.list.filter((entry) => {
      const entryHour = new Date(entry.dt * 1000).getUTCHours();
      return entryHour === 12; // Keep only entries with a timestamp of 12:00 PM (noon)
  });
  console.log('Weather forecast data:', filteredData);// Log the weather forecast data

  return filteredData;
}

/**
* Function to display current and future weather conditions
* 
* @param Array weatherData - Contains an array of weather data. The first item is the current weather
*/
function displayWeatherConditions(weatherData) {
  const currentWeatherData = weatherData[0]; // Assuming the first element contains current weather

  const forecastData = weatherData.slice(1); // Assuming the rest of the elements are the 5-day forecast

  displayCurrentWeather(currentWeatherData);
  displayWeatherForecast(forecastData);
}

/**
* Display current weather conditions
* 
* @param JSON currentWeatherData - Contains the current weather conditions
*/
function displayCurrentWeather(currentWeatherData) {
  const city = getCity();
  const currentWeatherDiv = document.getElementById('weather-data');
  // Format and display data
  currentWeatherDiv.innerHTML = `
          <h2>${city} (${new Date(currentWeatherData.dt * 1000).toLocaleDateString()})</h2>
          <img src="http://openweathermap.org/img/wn/${currentWeatherData.weather[0].icon}.png" alt="${currentWeatherData.weather[0].description}" />
          <p>Temperature: ${currentWeatherData.main.temp}°F</p>
          <p>Humidity: ${currentWeatherData.main.humidity}%</p>
          <p>Wind Speed: ${currentWeatherData.wind.speed} MPH</p>
          `;
}

/**
* Display 5-day forecast
* 
* @param Array forecastData - Contains forecasted weather
*/
function displayWeatherForecast(forecastData) {
  const forecastDiv = document.getElementById('forecast-data');
  // Format and display data
  forecastDiv.innerHTML = '';

  forecastData.forEach(day => {
      const dayDiv = document.createElement('div');
      // If your units of measurements is standard and not imperial
      // you will have to convert kelvins to farenheit: (day.min.temp - 273.15) * 9 / 5 + 32;
      dayDiv.innerHTML = `
              <h3>${new Date(day.dt * 1000).toLocaleDateString()}</h3>
              <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="${day.weather[0].description}" />
              <p>Temperature: ${day.main.temp}°F</p>
              <p>Humidity: ${day.main.humidity}%</p>
              <p>Wind Speed: ${day.wind.speed} MPH</p>
              `;
      forecastDiv.appendChild(dayDiv);
  });
}

/**
* Function to save city to search history in localStorage
* 
* @param String city - The city to store in local storage
* @returns Array - cities that were searched
*/
function saveCityToSearchHistory(city) {
  // Save city to localStorage
  const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

  // Don't add duplicates!
  if (searchHistory.includes(city)) {
      return;
  }

  searchHistory.push(city);
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory));

  // Update search history display
  updateSearchHistoryDisplay(searchHistory);
}

/**
* 
* @param Array searchHistory - Array of cities that were searched
*/
function updateSearchHistoryDisplay(searchHistory) {
  const searchHistoryDiv = document.getElementById("history-list");
  searchHistoryDiv.innerHTML = '';

  searchHistory.forEach((city) => {
      const cityButton = document.createElement('button');
      cityButton.textContent = city;
      cityButton.classList.add('search-history-button');
      cityButton.addEventListener('click', async () => {
          // coordinates will also contain the current weather
          const coordinates = await fetchCoordinates(city);
          const weatherData = await fetchWeatherForecast(coordinates.coord.lat, coordinates.coord.lon);

          // Add the current weather to the front of the weather data
          weatherData.unshift(coordinates);

          displayWeatherConditions(weatherData);
      });

      searchHistoryDiv.appendChild(cityButton);
  });
}

/**
* 
* @returns String - The value in the city search field
*/
function getCity() {
  return document.querySelector('#city-input').value;
}

/**
* Event listener for form submission
*/
document.querySelector('#search-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  const city = getCity();

  if (city) {
      // coordinates will also contain the current weather
      const coordinates = await fetchCoordinates(city);
      const weatherData = await fetchWeatherForecast(coordinates.coord.lat, coordinates.coord.lon);

      // Add the current weather to the front of the weather data
      weatherData.unshift(coordinates);

      displayWeatherConditions(weatherData);
      saveCityToSearchHistory(city);

      document.querySelector('#city-input').value = '';
  }
});

/**
* Optional: Load search history from localStorage on page load
*/
document.addEventListener('DOMContentLoaded', () => {
  const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
  updateSearchHistoryDisplay(searchHistory);
});