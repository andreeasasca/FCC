const wrapper = document.querySelector(".wrapper");
const header = document.querySelector(".wrapper header");
const dateTime = document.querySelector("#date-time");
const inputPart = document.querySelector(".input-part");
const infoTxt = inputPart.querySelector(".info-txt");
const inputField = inputPart.querySelector("input");
const currentLocationBtn = inputPart.querySelector(".current-location");
const customLocationBtn = inputPart.querySelector(".custom-location");
const weatherPart = wrapper.querySelector(".weather-part");
const weatherIcon = weatherPart.querySelector("img");
const arrowBack = wrapper.querySelector("header i");
let api;
let icon;
let iconPath;

inputField.addEventListener("keyup", e => {
    if(e.key == "Enter" && inputField.value != "") {
        getWeatherByCity(inputField.value);
    } else if (e.key == "Enter" && inputField.value == "") {
        infoTxt.classList.add("error");
        infoTxt.innerText = "Introdu orasul pentru care vrei sa afli starea vremii.";
    }
});

customLocationBtn.addEventListener("click", () => {
    if(inputField.value != "") {
        getWeatherByCity(inputField.value);
    } else if (inputField.value == "") {
        infoTxt.classList.add("error");
        infoTxt.innerText = 'Introdu orasul pentru care vrei sa afli starea vremii.';
    }
});

currentLocationBtn.addEventListener("click", () => {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getWeatherByCoordonates);
    } else {
        alert("Browserul nu accepta API-ul de localizare geografica");
    }
});

function getWeatherByCity(city) {
    api = `//localhost:5000/weatherbycity?city=${city}`;
    getWeather(api);
}

function getWeatherByCoordonates(position) {
    const {latitude, longitude} = position.coords;
    api =  `//localhost:5000/weatherbycoordinates?latitude=${latitude}&longitude=${longitude}`;
    getWeather(api);
}

function getWeather(api) {
    infoTxt.innerText = "Se obtin detaliile despre vreme...";
    infoTxt.classList.add("pending");
    fetch(api).then(res => res.json()).then(result => getWeatherDetails(result)).catch(() => {
        infoTxt.innerText = "A aparut o eroare!";
        infoTxt.classList.replace("pending", "error");
    });
}

function getWeatherDetails(info) {
    if(info.cod == "404"){
        infoTxt.classList.replace("pending", "error");
        infoTxt.innerText = `${inputField.value} nu este un oras valid.`;
    } else {
        const city = info.name;
        const country = info.sys.country;
        const {description, id} = info.weather[0];
        const {temp, feels_like, humidity, pressure} = info.main;
        const {sunrise, sunset} = info.sys;
        const {speed} = info.wind;

        getWeatherIcon(id);
        weatherIcon.src = getIconPath(sunset);

        weatherPart.querySelector(".temp .numb").innerText = Math.floor(temp);
        weatherPart.querySelector(".weather").innerText = description;
        weatherPart.querySelector(".location span").innerText = `${city}, ${country}`;
        weatherPart.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
        weatherPart.querySelector(".humidity span").innerText = `${humidity}%`;
        weatherPart.querySelector(".pressure span").innerText = `${pressure} hPa`;
        weatherPart.querySelector(".sunrise span").innerText = `${new Date(sunrise * 1000).toLocaleString("en-GB")}`;
        weatherPart.querySelector(".sunset span").innerText = `${new Date(sunset * 1000).toLocaleString("en-GB")}`;
        weatherPart.querySelector(".speed span").innerText = `${(speed * 3.6).toFixed(2)} km/h`;
        infoTxt.classList.remove("pending", "error");
        infoTxt.innerText = "";
        inputField.value = "";

        wrapper.classList.add("active");
        replaceHeaderText();
    }
}

function getWeatherIcon(id) {
    id == 800 ? icon = 'clear':
    id >= 200 && id <= 232 ? icon = 'storm':
    id >= 600 && id <= 622 ? icon = 'snow':
    id >= 701 && id <= 781 ? icon = 'haze':
    id >= 801 && id <= 804 ? icon = 'cloud':
    (id >= 500 && id <= 531) || (id >= 300 && id <= 321) ? icon = 'rain':
    null;
}

function getIconPath(sunset) {
    if((Date.now()/1000) > sunset) {
        return iconPath = `icons/night/${icon}.svg`;
    } else {
        return iconPath = `icons/day/${icon}.svg`;
    }
}

arrowBack.addEventListener("click", ()=> {
    wrapper.classList.remove("active");
    replaceHeaderText();
});

function replaceHeaderText() {
    if(wrapper.classList.contains("active")) {
        header.removeChild(dateTime);
        header.childNodes[1].replaceWith("Inapoi la selectarea locatiei");
    } else {
        header.childNodes[1].replaceWith("Starea vremii pentru astazi,");
        header.appendChild(dateTime);
    }
  }

function setCurrentDate() {
    let currentDateTime = new Date();
    const options = { weekday: "long" };
    let weekday = new Intl.DateTimeFormat("en-US", options).format(currentDateTime);
    let day = currentDateTime.getDate();
    let month = currentDateTime.getMonth() + 1;
    let year = currentDateTime.getFullYear();
    var currentDate =   weekday + "/" + day + "." + month + "." + year;
    return currentDate;
}

dateTime.innerHTML = setCurrentDate();