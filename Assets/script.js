
moment().format('L');

//-----------------------Search for Current City Weather Info----------------------------------//
function searchCity(cityname) {
var APIkey = "0a13129dc770be134c939e0222c40958"
var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityname + "&units=imperial&appid=" + APIkey;
var queryURLforecast = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityname + "&units=imperial&appid=" + APIkey;

$.ajax({
    url: queryURL,
    method: 'GET'
}).then(function (response) {
    console.log(response);
    console.log(queryURL);
    //empty div and id to use for info content
    $("#current").empty();
   var mainDate = moment().format('L');


    //create city info for page
    var cityNameEl = $("<h2>").text(response.name);
    var showDate = cityNameEl.append(" " + mainDate);
    var tempEL = $("<p>").text("Tempraturer: " + response.main.temp);
    var humEl = $("<p>").text("Humidity: " + response.main.humidity);
    var windEl = $("<p>").text("Wind Speed: " + response.wind.speed);
    var currentweather = response.weather[0].main;

    if (currentweather === "Rain") {
        var currentIcon = $('<img>').attr("src", "http://openweathermap.org/img/wn/09d.png");
        currentIcon.attr("style", "height: 60px; width: 60px");
    } else if (currentweather=== "Clouds") {
        var currentIcon = $('<img>').attr("src", "http://openweathermap.org/img/wn/03d.png");
        currentIcon.attr("style", "height: 60px; width: 60px");
    } else if (currentweather === "Clear") {
        var currentIcon = $('<img>').attr("src", "http://openweathermap.org/img/wn/01d.png");
        currentIcon.attr("style", "height: 60px; width: 60px");
    }
     else if (currentweather === "Drizzle") {
        var currentIcon = $('<img>').attr("src", "http://openweathermap.org/img/wn/10d.png");
        currentIcon.attr("style", "height: 60px; width: 60px");
    }
     else if (currentweather === "Snow") {
        var currentIcon = $('<img>').attr("src", "http://openweathermap.org/img/wn/13d.png");
        currentIcon.attr("style", "height: 60px; width: 60px");
    }
    //create div, append new elements
    var newDiv = $('<div>');

    newDiv.append(showDate, currentIcon, tempEL, humEl, windEl);

    $("#current").html(newDiv);
    
//--------------------------------------------- UV call ---------------------------------------//

var lat = response.coord.lat;
var lon = response.coord.lon;
var queryURLUV = "https://api.openweathermap.org/data/2.5/uvi?&appid=" + APIkey + "&lat=" + lat  + "&lon=" + lon;

    $.ajax({
        url: queryURLUV,
        method: 'GET'
    }).then(function (response) {
        $('#uvl-display').empty();
        var uvresults = response.value;
        //create new div
        var uvlEl = $("<button id='btn-uvl'>").text("UV Index: " + uvresults);
            uvlEl.css("color", "white");
// ---------------------Set UV indicator color according to results--------------------------------//
        
        if (uvresults < 3){
            uvlEl.css("background-color", "green");
        }
        else if (uvresults >= 3 && uvresults <= 5){
            uvlEl.css("background-color", "yellow"),
            uvlEl.css("color", "black");
        }
        else  if (uvresults > 5 && uvresults <= 7) {
            uvlEl.css("background-color", "orange");
        }
        else if (uvresults > 7 && uvresults <= 10){
         uvlEl.css("background-color", "red"); 
        }

        $('#uvl-display').html(uvlEl);

    });

});


// --------------------------------------------5Day forecast ---------------------------------------//

$.ajax({
    url: queryURLforecast,
    method: 'GET'
}).then(function (response) {
    // Store array of results in variable
    var results = response.list;
    //empty div
    $("#5day").empty();
    //create HTML for 5day forecast
    for (var i = 0; i < results.length; i += 8) {
        // Create five day div
        var fiveDayDiv = $("<div class='card shadow-lg text-white bg-primary mx-auto mb-10 p-2' style='width: 8.5rem; height: 11rem;'>");
        
        //Store responses to temp, humidity, date
        var date = results[i].dt_txt;
        var sateDate = date.substr(0,10)
        var temp = results[i].main.temp;
        var humid = results[i].main.humidity;

        //create tags with result information
        var h5date = $("<h5 class='card-title'>").text(sateDate);
        var pTemp = $("<p class='card-text'>").text("Temp: " + temp);;
        var pHumid = $("<p class='card-text'>").text("Humidity " + humid);;

        var weather = results[i].weather[0].main

        if (weather === "Rain") {
            var icon = $('<img>').attr("src", "http://openweathermap.org/img/wn/09d.png");
            icon.attr("style", "height: 40px; width: 40px");
        } else if (weather === "Clouds") {
            var icon = $('<img>').attr("src", "http://openweathermap.org/img/wn/03d.png");
            icon.attr("style", "height: 40px; width: 40px");
        } 
         else if (weather === "Clear") {
            var icon = $('<img>').attr("src", "http://openweathermap.org/img/wn/01d.png");
            icon.attr("style", "height: 40px; width: 40px");
        }
         else if (weather === "Drizzle") {
            var icon = $('<img>').attr("src", "http://openweathermap.org/img/wn/10d.png");
            icon.attr("style", "height: 40px; width: 40px");
        }
         else if (weather === "Snow") {
            var icon = $('<img>').attr("src", "http://openweathermap.org/img/wn/13d.png");
            icon.attr("style", "height: 40px; width: 40px");
        }

        //append items
        fiveDayDiv.append(h5date);
        fiveDayDiv.append(icon);
        fiveDayDiv.append(pTemp);
        fiveDayDiv.append(pHumid);
        $("#5day").append(fiveDayDiv);
    }

});



}
pageLoad();
//----------------------------------------Event handler for city search-----------------------//

$("#select-city").on("click", function (event) {
// Prevent button from trying to submit form
event.preventDefault();
// Store city 
var cityInput = $("#city-input").val().trim();

//save search to local storage
var textContent = $(this).siblings("input").val();
var storearr = [];
storearr.push(textContent);
localStorage.setItem('cityName', JSON.stringify(storearr));

searchCity(cityInput);
pageLoad();
});

//---------------------------Stored items on page load-------------------------------------//
function pageLoad () {
var lastSearch = JSON.parse(localStorage.getItem("cityName"));
var searchDiv = $("<button class='btn border text-muted mt-1 shadow-sm bg-white rounded' style='width: 12rem;'>").text(lastSearch);
var psearch = $("<div>");
psearch.append(searchDiv)
$("#searchhistory").prepend(psearch);
}

//Event deligation
$("#searchhistory").on('click', '.btn', function(event) {
event.preventDefault();
console.log($(this).text());
searchCity($(this).text());

});



