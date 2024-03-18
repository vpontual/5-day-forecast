const apiKey = "a5cf1c39c17df762a24e6365caa32a85";
const recentSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];

const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const recentSearchesList = document.getElementById("recent-searches");
const cityName = document.getElementById("city-name");
const weatherInfo = document.getElementById("weather-info");
const forecast = document.getElementById("forecast");

searchBtn.addEventListener("click", searchWeather);

function searchWeather() {
  const city = cityInput.value.trim();
  if (city) {
    fetchWeatherData(city);
    addToRecentSearches(city);
  }
}

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

function displayWeatherData(data) {
  const { name, weather, main } = data.list[0];
  const { description, icon } = weather[0];
  const { temp, humidity } = main;

  cityName.textContent = name;
  weatherInfo.innerHTML = `
    <p>Current Weather: ${description}</p>
    <img src="http://openweathermap.org/img/w/${icon}.png" alt="${description}">
    <p>Temperature: ${temp}&deg;F</p>
    <p>Humidity: ${humidity}%</p>
  `;
}

function displayForecast(data) {
  const forecastList = data.list.filter((item, index) => index % 8 === 0);
  let forecastHTML = `<div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 g-2">`;

  forecastList.forEach((item) => {
    const { dt_txt, weather, main } = item;
    const { description, icon } = weather[0];
    const { temp_min, temp_max } = main;

    forecastHTML += `
      <div class="col">
        <div class="card h-100 forecast-card">
          <div class="card-body">
            <h5 class="card-title">${dt_txt}</h5>
            <p class="card-text">${description}</p>
            <img src="http://openweathermap.org/img/w/${icon}.png" alt="${description}">
            <p>Min: ${temp_min}&deg;F | Max: ${temp_max}&deg;F</p>
          </div>
        </div>
      </div>
    `;
  });

  forecastHTML += `</div>`;
  forecast.innerHTML = forecastHTML;
}

function addToRecentSearches(city) {
  if (!recentSearches.includes(city)) {
    recentSearches.push(city);
    localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
    displayRecentSearches();
  }
}

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

displayRecentSearches();
