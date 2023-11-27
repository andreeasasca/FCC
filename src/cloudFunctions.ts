var https = require("https");

const getUnitsString = (rawUnitsQuery) => {
    if (!rawUnitsQuery || rawUnitsQuery == 'metric') {
        return 'metric'
    } else {
        return 'imperial'
    }
}

const makeWeatherRequest = (clientRes, options) => {
    https.request(options, (response) => {
        var str = '';
        response.on('data', function (chunk) {
            str += chunk;
        });
        response.on('close', () => {
            clientRes.writeHead(200, { 'Content-Type': "text/html" });
            clientRes.write(str);
            clientRes.end()
        });
    }).end();
}

exports.getWheather = (req, res) => {
    const key = '967860b2592661327a8018fe90e188d3';
    const options = {
        host: 'api.openweathermap.org',
        path: ''
    };
    const defaultLon = 26.1063;
    const defaultLat = 44.4268;
    let lon = req.query.lon || req.body.lon || defaultLon;
    let lat = req.query.lat || req.body.lat || defaultLat;
    let units = getUnitsString(req.query.units)

    options.path = `/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${key}`
    makeWeatherRequest(res, options)
};

var https = require("https");

exports.getWeatherByCity = (req, res) => {
    const key = '967860b2592661327a8018fe90e188d3';
    const options = {
        host: 'api.openweathermap.org',
        path: ''
    };
    const defaultCity = 'Bucharest';
    const defaultUnits = 'metric';
    const city = req.query.city || req.body.city || defaultCity;
    const units = req.query.units || req.body.units || defaultUnits;
    options.path = `/data/2.5/weather?q=${city}&units=${units}&appid=${key}`
    makeWeatherRequest(res, options)
};