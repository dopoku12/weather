const savedSearch = document.querySelector('.savedSearch')
const search = document.getElementById('search')
const searchBtn = document.getElementById('searchBtn')
const clearBtn = document.getElementById('clearBtn')
const nameNDtime = document.getElementById("nameNDtime")
const temp = document.getElementById("temp")
const wind = document.getElementById("wind")
const humidity = document.getElementById("humidity")
const uvIndex = document.getElementById("uvIndex")
const temp1 = document.getElementById('temp1')

let searchArr = []
function save(searchVal) {
    searchVal.forEach(searchHis => {
        searchHis.push(searchArr)
        localStorage.setItem('Search History', JSON.stringify(searchHis))
        console.log(localStorage);
    });
}


function load() {
    let history = JSON.parse(localStorage.getItem('Search History'));
    console.log(history)
    history.forEach((prevSearch) => {
        const liTag = document.createElement("li")
        liTag.innerText = prevSearch
        savedSearch.appendChild(liTag)
    });

}
window.onload = load()

const initialize = () => {
    let searchVal = search.value.trim()
    weatherApi(searchVal)
    save(searchVal)
    load()
}

searchBtn.addEventListener('click', e => {
    // e.preventDefault()
    initialize()

})


search.addEventListener('keydown', e => { if (e.keyCode === 13) initialize(); })


clearBtn.addEventListener('click', function (e) {
    e.preventDefault()
    localStorage.clear()
})



async function weatherApi(cityName) {
    let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=68ef11f1d0efb99f09ab6da7a559dd58`)
    let data = await response.json()
    const latitude = data.coord.lat
    const longitude = data.coord.lon
    //second Api    
    let responseTwo = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=imperial&exclude={part}&appid=68ef11f1d0efb99f09ab6da7a559dd58`)
    let dataTwo = await responseTwo.json()
    console.log('weatherApi :', dataTwo);
    //content
    console.log(dataTwo.timezone)
    const date = new Date().toLocaleString('en-US', { timeZone: `${dataTwo.timezone}` });
    console.log(date);
    let str = `${cityName.toUpperCase()}  (${date}) `
    console.log(str);
    const current = dataTwo.current
    temp.innerText = ` Temp: ${current.temp}°F`
    wind.innerText = ` Wind speed: ${current.wind_speed}MPH`
    humidity.innerText = ` Humidity: ${current.humidity}%`
    uvIndex.innerText = ` UV index: ${current.uvi}`
    nameNDtime.innerText = str
}


