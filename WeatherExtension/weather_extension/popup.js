const API_KEY = "d1845658f92b31c64bd94f06f7188c9c"; // Replace with your OpenWeatherMap API key

// Tabs and Containers
const yourWeatherTab = document.getElementById("yourWeatherTab");
const searchWeatherTab = document.getElementById("searchWeatherTab");
const grantAccessContainer = document.getElementById("grantAccessContainer");
const searchForm = document.getElementById("searchForm");
const loadingContainer = document.getElementById("loadingContainer");
const weatherInfoContainer = document.getElementById("weatherInfoContainer");

// Toggle Tabs
yourWeatherTab.addEventListener("click", () => {
  activateTab("yourWeather");
});
searchWeatherTab.addEventListener("click", () => {
  activateTab("searchWeather");
});

// Activate Tabs
function activateTab(tab) {
  if (tab === "yourWeather") {
    grantAccessContainer.classList.add("active");
    searchForm.classList.remove("active");
    weatherInfoContainer.classList.remove("active");
  } else if (tab === "searchWeather") {
    grantAccessContainer.classList.remove("active");
    searchForm.classList.add("active");
    weatherInfoContainer.classList.remove("active");
  }
}

// Grant Location Access
document.getElementById("grantAccessButton").addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log("Geolocation:", { latitude, longitude }); // Debugging log
        showLoading();
        const weatherData = await fetchWeatherByCoordinates(latitude, longitude);
        if (weatherData) renderWeather(weatherData);
      },
      (error) => {
        console.error("Geolocation Error:", error); // Debugging log
        alert("Unable to fetch location. Please ensure location is enabled.");
      }
    );
  } else {
    alert("Geolocation is not supported by this browser.");
  }
});


// Handle Search Form
searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const city = document.getElementById("cityInput").value.trim();
  if (city) {
    showLoading();
    const weatherData = await fetchWeatherByCity(city);
    renderWeather(weatherData);
  }
});

// Fetch Weather by Coordinates
async function fetchWeatherByCoordinates(lat, lon) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${response.statusText}`);
    }
    const data = await response.json();
    console.log("API Response (Coordinates):", data); // Debugging log
    return data;
  } catch (error) {
    console.error("Fetch error (Coordinates):", error); // Debugging log
    alert("Failed to fetch weather information. Please try again.");
    loadingContainer.classList.remove("active");
    return null;
  }
}



// Fetch Weather by City
async function fetchWeatherByCity(city) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
  );
  return response.json();
}

// Show Loading
function showLoading() {
  grantAccessContainer.classList.remove("active");
  searchForm.classList.remove("active");
  weatherInfoContainer.classList.remove("active");
  loadingContainer.classList.add("active");
}

// Render Weather Info
function renderWeather(weatherData) {
  if (!weatherData || !weatherData.main || !weatherData.weather) {
    alert("Failed to retrieve weather information.");
    loadingContainer.classList.remove("active");
    return;
  }

  const cityName = weatherData.name || "Unknown Location";
  const temperature = weatherData.main.temp || "N/A";
  const weatherDescription =
    weatherData.weather[0]?.description || "No description available";

  console.log("Rendering Weather Data:", {
    cityName,
    temperature,
    weatherDescription,
  });

  // Update UI elements
  document.getElementById("cityName").innerText = cityName;
  document.getElementById("temperature").innerText = `${temperature}°C`;
  document.getElementById("weatherDescription").innerText = weatherDescription;

  loadingContainer.classList.remove("active");
  weatherInfoContainer.classList.add("active");
}


