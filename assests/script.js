const savedSearch = document.querySelector('.savedSearch')
const search = document.getElementById('search')
const searchBtn = document.getElementById('searchBtn')
const clearBtn = document.getElementById('clearBtn')
const temp = document.getElementById("temp")
const wind = document.getElementById("wind")
const humidity = document.getElementById("humidity")
const uvIndex = document.getElementById("uvIndex")
const temp1 = document.getElementById('temp1')


const save = function () {

    localStorage.setItem(`${search.value}`, JSON.stringify(weatherApi))
    console.log(localStorage);
    const liTag = document.createElement("li")
    savedSearch.appendChild(liTag)
    liTag.textContent = search.value


}



searchBtn.addEventListener('click', function () {
    weatherApi(search.value)
    save()
})

search.addEventListener('keydown', function (e) {
    console.log(e);
    e.keyCode === 13 ? weatherApi(search.value) & save() : console.log('wrong key');

})








clearBtn.addEventListener('click', function (e) {
    e.preventDefault()
    localStorage.clear()
})



async function weatherApi(cityName) {
    let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=68ef11f1d0efb99f09ab6da7a559dd58`)
    let data = await response.json()
    const latitude = data.coord.lat
    const longitude = data.coord.lon
    let responseTwo = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=imperial&exclude={part}&appid=68ef11f1d0efb99f09ab6da7a559dd58`)
    let dataTwo = await responseTwo.json()
    console.log('weatherApi :', dataTwo);

    data.name
    const current = dataTwo.current
    temp.textContent = ` Temp: ${current.temp}°F`
    wind.textContent = ` Wind speed: ${current.wind_speed}MPH`
    humidity.textContent = ` Humidity: ${current.humidity}%`
    uvIndex.textContent = ` UV index: ${current.uvi}`

}








