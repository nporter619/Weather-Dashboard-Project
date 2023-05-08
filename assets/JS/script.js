// Function to fetch coordinates based on city name
async function fetchCoordinates(city) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${config.openWeatherApiKey}`);
    const data = await response.json();
  
    return {
      lat: data.coord.lat,
      lon: data.coord.lon,
    };
  }
  
  // Function to fetch the 5-day weather forecast based on coordinates
  async function fetchWeatherForecast(lat, lon) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${config.openWeatherApiKey}`);
    const data = await response.json();
  
    return data.list;
  }
  
  // Function to display current and future weather conditions
  function displayWeatherConditions(weatherData) {
    // Display current weather conditions
  
    // Display 5-day forecast
  }
  
  // Function to save city to search history in localStorage
  function saveCityToSearchHistory(city) {
    // Save city to localStorage
  
    // Update search history display
  }
  
  // Event listener for form submission
  document.querySelector('#search-form').addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const city = document.querySelector('#city-input').value;
  
    if (city) {
      const { lat, lon } = await fetchCoordinates(city);
      const weatherData = await fetchWeatherForecast(lat, lon);
  
      displayWeatherConditions(weatherData);
      saveCityToSearchHistory(city);
  
      document.querySelector('#city-input').value = '';
    }
  });
  
  // Optional: Load search history from localStorage on page load
  