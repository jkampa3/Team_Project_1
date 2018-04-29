var apiKey = "33a8ac12edb4b6b08d1eec131d0e4795";
var city = "minneapolis";
var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + apiKey;

$.ajax({
    url: queryURL,
    method: "GET"
})
    .then(function (weatherAPIFetch) {
        
        console.log(queryURL);
        console.log(weatherAPIFetch);

        //$(".city").html("<h1>" + response.name + " Weather Details</h1>");
        $("#weatherAPITemp").text(weatherAPIFetch.main.temp);
        $("#weatherAPICondition").text(weatherAPIFetch.weather[0].main);
        //ICON

        console.log("Temperature (F): " + weatherAPIFetch.main.temp);
        console.log("Current Condition: ") + weatherAPIFetch.weather[0].main;
    });