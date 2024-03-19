const apiKey = "a5cf1c39c17df762a24e6365caa32a85";

// Get recent searches from local storage (or initialize empty array)
const recentSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];

// DOM element references
const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const recentSearchesList = document.getElementById("recent-searches");
const cityName = document.getElementById("city-name");
const weatherInfo = document.getElementById("weather-info");
const forecast = document.getElementById("forecast");

// Add event listener to search button
searchBtn.addEventListener("click", searchWeather);

/**
 * Function to handle the search button click.
 * - Gets the trimmed city name from the input field.
 * - If a city name is entered, fetches weather data and adds it to recent searches.
 */
function searchWeather() {
  const city = cityInput.value.trim();
  if (city) {
    fetchWeatherData(city);
    addToRecentSearches(city);
  }
}

/**
 * Function to fetch weather data from Open Weather Map API.
 * - Constructs the API URL with city name and API key.
 * - Fetches data, parses JSON response, and calls functions to display weather and forecast (if successful).
 * - Handles errors by logging them and displaying an error message.
 */
function fetchWeatherData(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      displayWeatherData(data);
      displayForecast(data);
    })
    .catch((error) => {
      console.error("Error:", error);
      weatherInfo.innerHTML = "<p>There was an error fetching the weather.</p>";
      forecast.innerHTML = "";
    });
}

/**
 * Function to display weather data for the searched city.
 * - Destructures weather properties from the data object.
 * - Checks if there's weather data in the response.
 * - Updates the city name and weather info content in the UI if data exists.
 * - Clears city name and weather info content if no data is found.
 */
function displayWeatherData(data) {
  const { name, weather, main, wind } = data.list[0];
  const { description, icon } = weather[0];
  const { temp, humidity } = main;
  const { speed } = wind;

  if (data.list.length > 0) {
    // Check if there's weather data
    cityName.textContent = name;
    weatherInfo.classList.add("weather-data"); // Add class if data exists
    weatherInfo.innerHTML = `
      <img src="http://openweathermap.org/img/w/${icon}.png" alt="${description}">
      <p>Temperature: ${temp}&deg;F</p>
      <p>Wind: ${speed}MPH</p>
      <p>Humidity: ${humidity}%</p>
    `;
  } else {
    cityName.textContent = ""; // Clear city name if no data
    weatherInfo.classList.remove("weather-data"); // Remove class if no data
    weatherInfo.innerHTML = ""; // Clear content if no data
  }
}

/**
 * Function to display weather data for the searched city.
 * - De-structures weather properties from the data object.
 * - Checks if there's weather data in the response.
 * - Updates the city name and weather info content in the UI if data exists.
 * - Clears city name and weather info content if no data is found.
 */
function displayForecast(data) {
  const forecastList = data.list.filter((item, index) => index % 8 === 0);
  let forecastHTML = "";

  if (forecastList.length > 0) {
    forecastHTML += `<div class="row pl-3">  <h4>5 Day Forecast:</h4>
    </div>`;

    forecastHTML += `<div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 g-2">`; // Grid for cards

    forecastList.forEach((item) => {
      const { dt, weather, main, wind } = item;
      const { description, icon } = weather[0];
      const { temp_min, temp_max, humidity } = main;
      const { speed } = wind;

      const date = new Date(dt * 1000);

      const formattedDate = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(date);

      forecastHTML += `
        <div class="col">
          <div class="card h-100 forecast-card">
            <div class="card-body">
              <h5 class="card-title">${formattedDate}</h5>  
              <img src="http://openweathermap.org/img/w/${icon}.png" alt="${description}">
              <p>High: ${temp_max}&deg;F<br>Low: ${temp_min}&deg;F</p>
              <p>Wind: ${humidity}MPH</p>
              <p>Humidity: ${humidity}%</p>
            </div>
          </div>
        </div>
      `;
    });

    forecastHTML += `</div>`;
  }

  forecast.innerHTML = forecastHTML;
}

You're absolutely right, the comments for addToRecentSearches and displayRecentSearches were incorrect. Here's the corrected version with accurate comments:

JavaScript
/**
 * Function to add a searched city to recent searches list (if not already there).
 * - Checks if the city is not already in the recent searches array.
 * - If not found, adds the city to the recent searches array.
 * - Updates local storage with the new recent searches list.
 * - Calls the function to display the updated recent searches list.
 */
function addToRecentSearches(city) {
  if (!recentSearches.includes(city)) {
    recentSearches.push(city);
    localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
    displayRecentSearches();
  }
}

/**
 * Function to display the list of recent searches in the UI.
 * - Clears the content of the recent searches list element.
 * - Iterates through the recent searches array.
 * - For each city, creates a new list item element and adds styling classes.
 * - Sets the content of the list item to the city name.
 * - Adds an event listener to the list item for clicking.
 * - Appends the created list item to the recent searches list element.
 */
function displayRecentSearches() {
  recentSearchesList.innerHTML = "";
  recentSearches.forEach((city) => {
    const li = document.createElement("li");
    li.classList.add(
      "list-group-item",
      "cursor-pointer",
      "p-2",
      "hover-bg-light"
    );
    li.textContent = city;
    li.addEventListener("click", () => {
      cityInput.value = city;
      searchWeather();
    });
    recentSearchesList.appendChild(li);
  });
}

//Runs the displayRecentSearches function on page load
displayRecentSearches();
