
// FETCH WEATHER
async function fetchWeather(){

    // variable to store value in text field
    let searchInput = document.getElementById("search").value;

    // constant to store weather data div
    const weatherDataSection = document.getElementById("weather-data");
    
    // make weather data div visible
    weatherDataSection.style.display = "block";
    
    // constant to store api key 
    const apiKey = '';

    // custom message for empty input field
    if(searchInput == ""){
        weatherDataSection.innerHTML = `
        <div>
            <h2>Empty Input!</h2>
            <p>Please try again with a valid <u>city name</u>.</p>
        </div>
        `;
        return;
    }

    // GET LONGITUTE AND LATITUDE
    async function getLonAndLat(){

        // search input, limit to 1 result
        const geocodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${searchInput.replace(" ", "%20")}&limit=1&appid=${apiKey}`;
        
        // fetch data from geocode API, pause until data is received
        const response = await fetch(geocodeURL);

        // error handling
        if (!response.ok){
            console.log("Bad response! ", response.status);
            return;
        }

        // get data in json format
        const data = await response.json();

        // if no city was found, display error message
        if(data.length == 0){
            console.log("Something went wrong here.");
            weatherDataSection.innerHTML = `
            <div>
                <h2>Invalid Input: "${searchInput}"</h2>
                <p>Please try again with a valid <u>city name</u>.</p>
            </div>
            `;
            return;
        }

        // if data is good, return 1st object in json array
        else{
            return data[0];
        }
    }   

    // GET WEATHER DATA
    async function getWeatherData(lon, lat){
       
        const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

        // fetch data from weather API, pause until data is received
        const response = await fetch(weatherURL);

        // error handling
        if (!response.ok){
            console.log("Bad response! ", response.status);
            return;
        }

        // get data in json format
        const data = await response.json();

        // new styling for weather data div
        weatherDataSection.style.display = "flex";

        // display data in weather data div
        weatherDataSection.innerHTML = `

        <!-- city icon --
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}" width="100" />
        
        <!-- city name, rounded temp in celcius, primary weather description -->
        <div>
            <h2>${data.name}</h2>
            <p><strong>Temperature:</strong> ${Math.round(data.main.temp - 273.15)}°C</p>
            <p><strong>Description:</strong> ${data.weather[0].description}</p>
        </div>
        `;
    }

    // clear search field
    document.getElementById("search").value = "";

    // get longitude and latitude, pause until data is received
    const geocodeData = await getLonAndLat();

    // get weather data if geocodeData is valid
    if (!geocodeData) 
        return;
    getWeatherData(geocodeData.lon, geocodeData.lat);
}