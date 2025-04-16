const weatherForecast = document.querySelector('.weather-forecast');
const h3Temperature = document.getElementById('temp');
const pFeelsLike = document.getElementById('feels_like');
const h3Main = document.getElementById('main');
const pDescription = document.getElementById('description');
const iconEl = document.querySelector('.icon');
const buttonSearch = document.getElementById('btn-Search');
const key = '6830ebdfda0c67a24a2d292b45c5bb19';
const pMessage = document.getElementById('message');
const h2Cod = document.getElementById('cod');
const sectionError = document.querySelector('.section-error');
const cityCountry = document.getElementById('city-country');

function addWeatherForecast(temp, feels_like, main, description, icon) {
    h3Temperature.innerText = `${temp}°C`;
    pFeelsLike.innerText =`Feels like ${feels_like} °C`;
    h3Main.innerText = `${main}`;
    pDescription.innerText = `${description}`;
    iconEl.innerHTML = `<img src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="Error" >`;
}
function ErrorMessage(cod, message) {
    pMessage.innerText = `${message}`;
    h2Cod.innerText =`${cod} `;
}
function addCityCountry(city , country) {
    cityCountry.innerText =  `${city}, ${country}`;
}

function requestaAndProcessing(event) {
    event.preventDefault();
    let inputValue = document.getElementById('city').value;
    const request = fetch(` https://api.openweathermap.org/data/2.5/weather?q=${inputValue}&units=metric&appid=${key}`);
    request
        .then((response) => {
            return response.json();

        })
        .then((result) => {
            if (result.cod === 200) {
                sectionError.className = 'hidden';
                weatherForecast.className = 'weather-forecast';
                addWeatherForecast(result.main.temp, result.main.feels_like, result.weather[0].main, result.weather[0].description, result.weather[0].icon);
                addCityCountry(result.name , result.sys.country);
            } else {
                weatherForecast.className = 'hidden';
                sectionError.className = 'section-error';
                ErrorMessage(result.cod, result.message );
            }
        });
    document.getElementById('city').value = '';
}

buttonSearch.addEventListener('click', requestaAndProcessing);
document.addEventListener('click', event => {
    if (event.target.dataset.buttonType === 'clicked') {
        sectionError.className = 'hidden';
        weatherForecast.className = 'hidden';
    }
});