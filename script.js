// Declared variables

var city = "";
var citySearch = $("#search-city");
var search = $("#search-button");
var clear = $("#clear-history");
var currentCity = $("#current");
var currentTemp = $("#temperature");
var currentHumid = $("#humidity");


// Search for cities that exist in the storage
function fund(c) {
    for (var i = 0; i < sCity.length; i++) {
        if (c.toUpperCase() === sCity[i]) {
            return -1;
        }
    }
    return 1;
}

// Display the curent and future weather
function displayWeather(event) {
    event.preventDefault();
    if (citySearch.val().trim() !== "") {
        city = citySearch.val().trim();
        currentWeather(city);
    }
}

// AJAX call
function currentWeather(city) {
    // URL to the API
    var queryURL = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=" + APIKey;
    $.getJSON(queryURL).then(function (geoCodes) {

        // Display City Name, weather, temp, humidity, etc.
        console.log(geoCodes);

        var geoCode = geoCodes[0];
        var lon = geoCode.lon;
        var lat = geoCode.lat;
        var queryURL2 = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&units=imperial&cnt=40";

        $.getJSON(queryURL2).then(function (response) {
            console.log(response)

            var day0 = response.list[0];
            console.log(day0);
            var day1 = response.list[8];
            console.log(day1);
            var day2 = response.list[16];
            console.log(day2);
            var day3 = response.list[24];
            console.log(day3);
            var day4 = response.list[32];
            console.log(day4);
            var day5 = response.list[39];
            console.log(day5);
            var days = [day1, day2, day3, day4, day5];

            for (var i = 0; i < days.length; i++) {
                var date = new Date(days[i].dt * 1000).toLocaleDateString();
                $("#fDate" + i).html(date);
                var weathericon = days[i].weather[0].icon;
                var iconurl = "https://openweathermap.org/img/wn/" + weathericon + "@2x.png";
                $("#fImg" + i).html("<img src=" + iconurl + ">");
                var tempF = days[i].main.temp;
                $("#fTemp" + i).html(tempF + "&#8457");
                $("#fHumidity" + i).html(days[i].main.humidity + "%");
            }

            var date = new Date(day0.dt * 1000).toLocaleDateString();
            var weathericon = day0.weather[0].icon;
            var iconurl = "https://openweathermap.org/img/wn/" + weathericon + "@2x.png";
            $(currentCity).html(response.name + "(" + date + ")" + "<img src=" + iconurl + ">");
            var tempF = day0.main.temp;
            currentTemp.html(tempF + "&#8457");
            currentHumid.html(day0.main.humidity + "%");
            


            //  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date

        
        })
    });
}


// Adds searched city to history
function addToList(c) {
    var listEl = $("<li>" + c.toUpperCase() + "</li>");
    $(listEl).attr("class", "list-group-item");
    $(listEl).attr("data-value", c.toUpperCase());
    $(".list-group").append(listEl);
}
// Display past search history
function invokePastSearch(event) {
    var liEl = event.target;
    if (event.target.matches("li")) {
        city = liEl.textContent.trim();
        currentWeather(city);
    }

}

// render function
function loadlastCity() {
    $("ul").empty();
    var sCity = JSON.parse(localStorage.getItem("cityname"));
    if (sCity !== null) {
        sCity = JSON.parse(localStorage.getItem("cityname"));
        for (i = 0; i < sCity.length; i++) {
            addToList(sCity[i]);
        }
        city = sCity[i - 1];
        currentWeather(city);
    }

}
//Clear the search history
function clearHistory(event) {
    event.preventDefault();
    sCity = [];
    localStorage.removeItem("cityname");
    document.location.reload();

}
//Click Handlers
$("#search-button").on("click", displayWeather);
$(document).on("click", invokePastSearch);
$(window).on("load", loadlastCity);
$("#clear-history").on("click", clearHistory);
