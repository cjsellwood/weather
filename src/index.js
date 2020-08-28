import "./styles.css";
import regeneratorRuntime from "regenerator-runtime";
import White from "./images/White.png";
import Rain from "./images/Rain.png";
import Clouds from "./images/Clouds.png";
import Clear from "./images/Clear.png";
import Moon from "./images/Moon.png";
import Smoke from "./images/Smoke.png";
import Mist from "./images/Mist.png";
import Thunderstorm from "./images/Thunderstorm.png";
import Dust from "./images/Dust.png";
import Snow from "./images/Snow.png";
import Tornado from "./images/Tornado.png";

async function getWeather(location) {
  // Set api key - shouldn't do if important api key
  const key = "1ab92a784fc48e4915bb0d875f1cd316";

  // Display loading icon while fetching data
  const loading = document.getElementById("loading");
  loading.style.display = "block";

  try {
    // Fetch response from api server
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${key}`,
      { mode: "cors" }
    );
    const weatherData = await response.json();
    const timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000;

    // Set values from returned data as object
    const weather = {
      temp: Number(weatherData.main.temp) - 273.15,
      feel: Number(weatherData.main.feels_like) - 273.15,
      min: Number(weatherData.main.temp_min) - 273.15,
      max: Number(weatherData.main.temp_max) - 273.15,
      description: weatherData.weather[0].description,
      time: new Date(
        1000 * Number(weatherData.dt) +
          timezoneOffset +
          1000 * Number(weatherData.timezone)
      ),
      sunrise: new Date(1000 * Number(weatherData.sys.sunrise)),
      sunset: new Date(1000 * Number(weatherData.sys.sunset)),
      wind: Number(weatherData.wind.speed) * 3.6,
      humidity: Number(weatherData.main.humidity),
      city: `${weatherData.name}, ${weatherData.sys.country}`,
      image: weatherData.weather[0].main,
    };

    // Change temperature to farenheit if selected
    const unitChange = document.getElementById("change-unit");
    if (unitChange.textContent === "°C") {
      weather.temp = weather.temp * 1.8 + 32;
      weather.feel = weather.feel * 1.8 + 32;
    }

    changeDisplay(weather);

    // Hide loading icon again
    loading.style.display = "none";

    return weather;

    // Handle any error
  } catch (err) {
    const searchInput = document.getElementById("location-input");
    searchInput.setAttribute("placeholder", "Not found");
    searchInput.style.border = "2px solid red";
    // Hide loading icon again
    loading.style.display = "none";
  }
}

function changeDisplay(weather) {
  // Create element for each output value
  const temperature = document.getElementById("temperature");
  const feelsLike = document.getElementById("feels-like");
  const description = document.getElementById("description");
  const time = document.getElementById("time");
  const date = document.getElementById("date");
  const wind = document.getElementById("wind");
  const humidity = document.getElementById("humidity");
  const city = document.getElementById("location");
  const image = document.getElementById("image");

  // Set text for each element
  temperature.textContent = weather.temp.toFixed(1);
  feelsLike.textContent = weather.feel.toFixed(1);
  description.textContent =
    weather.description[0].toUpperCase() + weather.description.slice(1);
  date.textContent = weather.time.toDateString();
  wind.textContent = weather.wind.toFixed(1);
  humidity.textContent = weather.humidity;
  city.textContent = weather.city;

  // Format time with am or pm
  let minutes = weather.time.toTimeString().slice(3, 5);
  let hours = weather.time.toTimeString().slice(0, 2);
  let formattedTime = "";

  if (Number(hours) === 12) {
    formattedTime = `${Number(hours)}:${minutes} pm`;
  } else if (Number(hours) > 11) {
    formattedTime = `${Number(hours) % 12}:${minutes} pm`;
  } else {
    formattedTime = `${hours}:${minutes} am`;
  }

  time.textContent = formattedTime;

  // Set image based on general weather category returned
  switch (weather.image) {
    case "Drizzle":
    case "Rain":
      image.setAttribute("src", Rain);
      break;
    case "Clouds":
      image.setAttribute("src", Clouds);
      break;
    case "Ash":
    case "Haze":
    case "Smoke":
      image.setAttribute("src", Smoke);
      break;
    case "Fog":
    case "Mist":
      image.setAttribute("src", Mist);
      break;
    case "Thunderstorm":
      image.setAttribute("src", Thunderstorm);
      break;
    case "Sand":
    case "Dust":
      image.setAttribute("src", Dust);
      break;
    case "Snow":
      image.setAttribute("src", Snow);
      break;
    case "Squall":
    case "Tornado":
      image.setAttribute("src", Tornado);
      break;
    case "Clear":
      if (weather.time < weather.sunset && weather.time > weather.sunrise) {
        image.setAttribute("src", Clear);
      } else {
        image.setAttribute("src", Moon);
      }
      break;
    default:
      image.setAttribute("src", Clear);
      break;
  }
}

// Default weather
getWeather("melbourne, au");

// Handle submission of location
const searchForm = document.getElementById("location-form");
searchForm.addEventListener("submit", () => {
  event.preventDefault();
  const searchInput = searchForm.querySelector("input");
  getWeather(searchInput.value);
  searchInput.value = "";
  window.scrollTo(0, 0);
});

// Reset to default search box if previous search was not found
searchForm.addEventListener("input", () => {
  const searchInput = searchForm.querySelector("input");
  searchInput.style.border = "2px solid rgb(195, 195, 195)";
  searchInput.setAttribute("placeholder", "Enter Location");
});

// Function to convert to fahrenheit
const unitBtn = document.getElementById("change-unit");
unitBtn.addEventListener("click", () => {
  let newUnit = "";
  if (unitBtn.textContent === "°F") {
    newUnit = "°F";
  } else {
    newUnit = "°C";
  }

  // Change displayed units
  const unit1 = document.getElementById("temperature-unit");
  unit1.textContent = newUnit;
  const unit2 = document.getElementById("temperature-unit2");
  unit2.textContent = newUnit;
  unitBtn.textContent = newUnit === "°F" ? "°C": "°F";

  const temperature = document.getElementById("temperature");
  const feelsLike = document.getElementById("feels-like");

  // Change temperature numbers
  if (newUnit === "°F") {
    temperature.textContent = (Number(temperature.textContent) * 1.8 + 32).toFixed(1);
    feelsLike.textContent = (Number(feelsLike.textContent) * 1.8 + 32).toFixed(1);
  } else {
    temperature.textContent = ((Number(temperature.textContent) -32) / 1.8).toFixed(1);
    feelsLike.textContent = ((Number(feelsLike.textContent) -32) / 1.8).toFixed(1);
  }

});
