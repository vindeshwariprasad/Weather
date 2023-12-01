const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static("public"));

app.post("/getWeather", async (req, res) => {
  try {
    const { cities } = req.body;
    const weatherData = await getWeatherData(cities);
    res.json({ weather: weatherData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

async function getWeatherData(cities) {
  const weatherData = {};

  await Promise.all(
    cities.map(async (city) => {
      try {
        const response = await axios.get(
          // console.log(
          //   city
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid={your key}&units=metric`
          // `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}`
        );
        const temperature = response.data.main.temp;
        weatherData[city] = `${temperature}°C`;
      } catch (error) {
        console.error(`Error fetching weather for ${city}: ${error.message}`);
        weatherData[city] = "N/A";
      }
    })
  );

  return weatherData;
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
