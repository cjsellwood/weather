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
    return weather;

    // Handle any error
  } catch (err) {
    console.log(err);
  }
}

function changeDisplay(weather) {
  // Create element for each output value
  const temperature = document.createElement("div");
  const feelsLike = document.createElement("div");
  const description = document.createElement("div");
  const time = document.createElement("div");
  const date = document.createElement("div");
  const wind = document.createElement("div");
  const humidity = document.createElement("div");
  const city = document.createElement("div");
  const image = document.createElement("img");

  // Set text for each element
  temperature.textContent = `Temperature: ${weather.temp.toFixed(1)}°C`;
  feelsLike.textContent = `Feels Like: ${weather.feel.toFixed(1)}°C`;
  description.textContent = weather.description;
  time.textContent = weather.time.toLocaleTimeString();
  date.textContent = weather.time.toLocaleDateString();
  wind.textContent = `Wind Speed: ${weather.wind.toFixed(1)} km/h`;
  humidity.textContent = `Humidity: ${weather.humidity}%`;
  city.textContent = weather.city;

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

  // Add to display
  const info = document.getElementById("info");
  //info.appendChild(temperature);
  info.appendChild(feelsLike);
  info.appendChild(description);
  //info.appendChild(time);
  //info.appendChild(date);
  info.appendChild(wind);
  info.appendChild(humidity);
  //info.appendChild(city);
  //info.appendChild(image);
}

let weather = getWeather("leongatha");

