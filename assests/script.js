"use strict"
//HTML CONTENT//
const savedSearch = document.querySelector('.savedSearch');
const search = document.getElementById('search');
const searchBtn = document.getElementById('searchBtn');
const clearBtn = document.getElementById('clearBtn');
//MAIN FORECAST CONTENT//
const icons = document.getElementById("icons");
const name = document.getElementById("name");
const globalDate = document.getElementById("date");
const time = document.getElementById("time");
const description = document.getElementById('description');
const mainTemp = document.getElementById(`mainTemp`);
const mainWind = document.getElementById(`mainWind`);
const mainHumidity = document.getElementById(`mainHumidity`);
const mainUvIndex = document.getElementById(`mainUvIndex`);
let num = 0
//INITIALIZE SEARCH AND SAVE// 
const initialize = () => {
    let searchValue = search.value.trim()
    display(searchValue)
    save(searchValue)
    // window.onload = load()
}
let inputArr = []
//SAVE SEARCH VALUE//
const save = (input) => {
    let outputArr = [input]
    outputArr.map(history => {
        localStorage.setItem('Search History', JSON.stringify(history));
        let parsedVal = JSON.parse(localStorage.getItem('Search History'));
        console.log('passed', parsedVal)
        const liTag = document.createElement("li")
        liTag.innerText = history
        savedSearch.appendChild(liTag)
    })
    // outputArr.forEach((history) => {
    //     console.log("history", history);
    // })
}
searchBtn.addEventListener('click', initialize);
search.addEventListener('keydown', e => { if (e.keyCode === 13) initialize(); });


async function createHtml(latitude, longitude, searchName = null) {
    // third API//
    let resThree = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=imperial&exclude={part}&appid=68ef11f1d0efb99f09ab6da7a559dd58`)
    console.log('long2:', longitude, 'lat2:', latitude)
    let dataThree = await resThree.json()
    console.log('weatherApi :', dataThree);
    console.log(dataThree.timezone)
    let resFour = await fetch(`http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=5&appid=68ef11f1d0efb99f09ab6da7a559dd58`)
    let dataFour = await resFour.json()
    console.log(dataFour)
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
    current.uvi >= 6 ? mainUvIndex.style.backgroundColor = 'red' : mainUvIndex.style.backgroundColor = 'green'

    //displaying time/date,cityName on .present-forecast//
    const dateObj = new Date()
    const date = dateObj.toLocaleString('en-US', { timeZone: `${dataThree.timezone}` });
    // const month = dateObj.toLocaleString('en-us', { month: 'long' });
    // const today = dateObj.toLocaleString("default", { weekday: "long" });
    const dateArr = date.split(',');

    console.log(dateArr);
    const hourNMin = dateArr[1].split(':');
    const meridian = dateArr[1].split(':')[2].split(" ");
    name.innerText = !searchName ? outputName : searchName;
    time.innerText = `${hourNMin[0]}:${hourNMin[1]} ${meridian[1]}`;
    globalDate.innerHTML = `${dateArr[0]}`
    //displaying forecast on .forecast
    let dailyArr = dataThree.daily

    dailyArr.forEach(function (day) {
        //DAILY FORECAST//
        if (num <= 4) {
            let temp = document.getElementById(`temp${num}`);
            let wind = document.getElementById(`wind${num}`);
            let humidity = document.getElementById(`humidity${num}`);
            let sideIcon = document.getElementById(`icon${num}`);
            temp.innerText = `${day.temp.day}°F`;
            sideIcon.innerHTML = `<img src= http://openweathermap.org/img/w/${day.weather[0].icon}.png></img>`;
        };
        num++
    });
}

function display(searchValue = null) {
    let inputName = searchValue
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
            let latitude = position.coords.latitude;
            let longitude = position.coords.longitude;
            createHtml(latitude, longitude)
            async function weatherApi(inputName) {
                if (inputName) {
                    let res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${inputName}&appid=68ef11f1d0efb99f09ab6da7a559dd58`)
                    console.log("res:", res);
                    let data = await res.json()
                    console.log('secondApi:', data);
                    //if (404/NOT FOUND) DOES NOT OCCUR PROCEED//
                    if (res.ok) {
                        const searchName = data.name
                        console.log('name:', searchName)
                        let latitude = data.coord.lat;
                        let longitude = data.coord.lon;
                        createHtml(latitude, longitude, searchName)
                        console.log('long:', longitude, 'lat:', latitude)
                    }
                }
            };
            return weatherApi(inputName);
        });
    }
}
display()
//clear
clearBtn.addEventListener('click', function (e) {
    e.preventDefault()
    localStorage.clear()
})