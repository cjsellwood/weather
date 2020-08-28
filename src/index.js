import "./styles.css";
import regeneratorRuntime from "regenerator-runtime";
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
    console.log(weatherData);

    // Set values from returned data as object
    const weather = {
      temp: Number(weatherData.main.temp) - 273.15,
      feel: Number(weatherData.main.feels_like) - 273.15,
      min: Number(weatherData.main.temp_min) - 273.15,
      max: Number(weatherData.main.temp_max) - 273.15,
      description: weatherData.weather[0].description,
      time: new Date(1000 * Number(weatherData.dt)),
      sunrise: new Date(1000 * Number(weatherData.sys.sunrise)),
      sunset: new Date(1000 * Number(weatherData.sys.sunset)),
      wind: Number(weatherData.wind.speed) * 3.6,
      humidity: Number(weatherData.main.humidity),
      city: `${weatherData.name}, ${weatherData.sys.country}`,
      image: weatherData.weather[0].main,
    };

    changeDisplay(weather);

    // Hide loading icon again
    loading.style.display = "none";

    return weather;

    // Handle any error
  } catch (err) {
    console.log(err);
    const searchInput = document.getElementById("location-input");
    searchInput.setCustomValidity("Not found");
    searchInput.style.border = "2px solid red";
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
  date.textContent = weather.time.toLocaleDateString();
  wind.textContent = weather.wind.toFixed(1);
  humidity.textContent = weather.humidity;
  city.textContent = weather.city;

  // Format time with am or pm
  let minutes = weather.time.toLocaleTimeString().slice(3, 5);
  let hours = weather.time.toLocaleTimeString().slice(0, 2);
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

const searchForm = document.getElementById("location-form");

searchForm.addEventListener("submit", () => {
  event.preventDefault();
  console.log(searchForm);
  const searchInput = searchForm.querySelector("input");
  getWeather(searchInput.value);
  searchInput.value = "";
});
