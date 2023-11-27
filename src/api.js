const request = require('request');

export function getWeather(url) {
	request({ url: url, json: true }, function (error, response) {
		if (error) {
			console.log('A aparut o eroare, incearca din nou.');
		}
		else {
      let weather = response.body;
      let weatherText = `Sunt ${weather.main.temp} grade Celsius in ${weather.name}!`;
      console.log(weatherText);
    }
  });
}