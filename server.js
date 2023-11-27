import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

const app = express();
const port = process.env.PORT || 5000;
const corsOptions = {
  origin:'http://127.0.0.1:5000', 
  credentials:true,
  optionSuccessStatus:200
}

dotenv.config();
app.use(express.json());
app.use(express.static('src'));
app.use(cors(corsOptions));

app.get("/weatherbycity", async (req, res) => {
  let city = req.query.city;

  if (city == undefined) {
    res.status(404).json("City is missing");
  } else {
    const response = await fetch(
      // `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.API_KEY}&lang=ro`,
      `https://us-central1-serverless-restful-api-405804.cloudfunctions.net/getWeatherByCity?city=${city}`,
    );
    const data = await response.json();
    res.status(200).json(data);
  }
});

app.get("/weatherbycoordinates", async (req, res) => {
  let latitude = req.query.latitude;
  let longitude = req.query.longitude;
  console.log(req);
  if (latitude == undefined || longitude == undefined) {
    res.status(404).json("Latitude or longitude are missing");
  } else {
    const response = await fetch(
      `https://us-central1-serverless-restful-api-405804.cloudfunctions.net/getWeather?lon=${longitude}&lat=${latitude}`,
      // `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${process.env.API_KEY}&lang=ro`,
    );
    const data = await response.json();
    res.status(200).json(data);
  }
});

app.listen(port, () => {
  console.log(`server is up on ${port}`);
});