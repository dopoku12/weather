"use strict"
//NAVIGATION ID'S//
const savedSearch = document.querySelector('.savedSearch');
const search = document.getElementById('search');
const searchBtn = document.getElementById('searchBtn');
const clearBtn = document.getElementById('clearBtn');
//MAIN FORECAST ID'S//
const icons = document.getElementById("icons");
const name = document.getElementById("name");
const globalDate = document.getElementById("date");
const time = document.getElementById("time");
const description = document.getElementById('description');
const mainTemp = document.getElementById(`mainTemp`);
const mainWind = document.getElementById(`mainWind`);
const mainHumidity = document.getElementById(`mainHumidity`);
const mainUvIndex = document.getElementById(`mainUvIndex`);
let num = 0;
//INITIALIZE SEARCH// 
const initialize = () => {
    let searchValue = search.value.trim();
    usrInput(searchValue);
}
searchBtn.addEventListener('click', initialize);
search.addEventListener('keydown', e => { if (e.keyCode === 13) initialize(); });

// CONVERTS USER INPUT INTO LAT LONG AND NAME//
async function usrInput(inputName) {
    let res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${inputName}&appid=68ef11f1d0efb99f09ab6da7a559dd58`)
    console.log("res:", res);
    let data = await res.json();
    console.log('secondApi:', data);
    //if (404/NOT FOUND) DOES NOT OCCUR PROCEED//
    if (res.ok) {
        const searchName = data.name;
        let latitude = data.coord.lat;
        let longitude = data.coord.lon;
        display(latitude, longitude, searchName);
    }
}

//DEFAULT USER LOCATION//
if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition((position) => {
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;
        display(latitude, longitude);
    });
}

// DISPLAY WEATHER DATA IN HTML// 
async function display(latitude, longitude, searchName = null) {
    // THIRD API WEATHER DATA //
    let resThree = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=imperial&exclude={part}&appid=68ef11f1d0efb99f09ab6da7a559dd58`)
    let dataThree = await resThree.json();
    //FOURTH API USED REVERSE GEOCODING//
    let resFour = await fetch(`http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=5&appid=68ef11f1d0efb99f09ab6da7a559dd58`)
    let dataFour = await resFour.json();
    const outputName = dataFour[0].name;
    //displaying forecast on .present-forecast//
    const current = dataThree.current;
    icons.innerHTML = `<img src= http://openweathermap.org/img/w/${current.weather[0].icon}.png></img>`;
    description.innerText = `${current.weather[0].description}`;
    mainTemp.innerText = `${current.temp}°F`;
    mainWind.innerText = `${current.wind_speed}MPH 
        Wind speed `;
    mainHumidity.innerText = `${current.humidity}%
     Humidity`;
    //uvIndex text content and backgroundColor//
    mainUvIndex.innerText = `UV index: ${current.uvi}`;

    current.uvi >= 6 ? mainUvIndex.style.backgroundColor = 'red'
        : mainUvIndex.style.backgroundColor = 'green';

    //displaying time/date,cityName on .present-forecast//
    const dateObj = new Date();
    const date = dateObj.toLocaleString('en-US', { timeZone: `${dataThree.timezone}` });
    const dateArr = date.split(',');
    const hourNMin = dateArr[1].split(':');
    const meridian = dateArr[1].split(':')[2].split(" ");
    name.innerText = !searchName ? outputName : searchName;
    time.innerText = `${hourNMin[0]}:${hourNMin[1]} ${meridian[1]}`;
    globalDate.innerHTML = `${dateArr[0]}`;
    //displaying forecast on .forecast//
    let dailyArr = dataThree.daily;
    dailyArr.forEach((day) => {
        //DAILY FORECAST//
        if (num <= 4) {
            let temp = document.getElementById(`temp${num}`);
            let wind = document.getElementById(`wind${num}`);
            let humidity = document.getElementById(`humidity${num}`);
            let sideIcon = document.getElementById(`icon${num}`);
            temp.innerText = `${day.temp.day}°F`;
            sideIcon.innerHTML = `<img src= http://openweathermap.org/img/w/${day.weather[0].icon}.png></img>`;
        };
        num++;
    });
    num = 0;
};