"use strict"
//HTML CONTENT//
const savedSearch = document.getElementsByClassName('savedSearch')
const search = document.getElementById('search')
const searchBtn = document.getElementById('searchBtn')
const clearBtn = document.getElementById('clearBtn')
//MAIN FORECAST CONTENT//
const nameNDtime = document.getElementById("nameNDtime")
const mainTemp = document.getElementById(`mainTemp`)
const mainWind = document.getElementById(`mainWind`)
const mainHumidity = document.getElementById(`mainHumidity`)
const mainUvIndex = document.getElementById(`mainUvIndex`)

//INITIALIZE SEARCH AND SAVE// 
let searchArr = []
const initialize = () => {
    let searchVal = search.value.trim()
    weatherApi(searchVal)
    save(searchVal)
    // load()
}

//SAVE SEARCH VALUE//
const save = (input) => {
    searchArr.push(input)
    console.log(searchArr);
    console.log('history :', input);

    searchArr.forEach((history) => {
        localStorage.setItem('Search History', JSON.stringify(history))
        let parsedVal = JSON.parse(localStorage.getItem('Search History'));
        console.log('passed', parsedVal)
    })
    const liTag = document.createElement("li")
    liTag.innerText = parsedVal
    savedSearch.appendChild(liTag)

};
searchBtn.addEventListener('click', initialize)
search.addEventListener('keydown', e => { if (e.keyCode === 13) initialize(); })
// window.onload = load()

async function weatherApi(inputName) {
    let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${inputName}&appid=68ef11f1d0efb99f09ab6da7a559dd58`)
    let data = await response.json()
    console.log('firstApi:', data);
    //if (404/NOT FOUND) DOES NOT OCCUR PROCEED//
    if (data.cod !== '404') {
        const outputName = data.name
        const latitude = data.coord.lat
        const longitude = data.coord.lon

        // third API//
        let responseTwo = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=imperial&exclude={part}&appid=68ef11f1d0efb99f09ab6da7a559dd58`)
        let dataTwo = await responseTwo.json()
        console.log('weatherApi :', dataTwo);
        console.log(dataTwo.timezone)
        //displaying forecast on .present-forecast//
        const current = dataTwo.current
        mainTemp.innerText = ` Temp: ${current.temp}°F`
        mainWind.innerText = ` Wind speed: ${current.wind_speed}MPH`
        mainHumidity.innerText = ` Humidity: ${current.humidity}%`
        //uvIndex text content and backgroundColor//
        mainUvIndex.innerText = ` UV index: ${current.uvi}`
        current.uvi >= 6 ? mainUvIndex.style.backgroundColor = 'red' : mainUvIndex.style.backgroundColor = 'green'

        //displaying time/date,cityName on .present-forecast//
        const date = new Date().toLocaleString('en-US', { timeZone: `${dataTwo.timezone}` });
        let str = `${outputName.toUpperCase()}  (${date})  `
        console.log(date);
        console.log(str);
        nameNDtime.innerText = str

        //displaying forecast on .forecast
        let dailyArr = dataTwo.daily
        let num = 0
        dailyArr.forEach(function (day) {
            //DAILY FORECAST//
            if (num <= 4) {

                let temp = document.getElementById(`temp${num}`)
                let wind = document.getElementById(`wind${num}`)
                let humidity = document.getElementById(`humidity${num}`)
                temp.innerText = `Temp: ${day.temp.day}°F`;
                wind.innerText = `Wind Speed: ${day.wind_speed}MPH`;
                humidity.innerText = `Humidity: ${day.humidity}%`;
            }
            num++
        }
        )

    }
    else {
        nameNDtime.innerText = `SORRY CITY NOT FOUND 😭`
    }

}

clearBtn.addEventListener('click', function (e) {
    e.preventDefault()
    localStorage.clear()
})