var apiKey = "33a8ac12edb4b6b08d1eec131d0e4795";
var city = "minneapolis";
var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + apiKey;

$.ajax({
    url: queryURL,
    method: "GET"
})
    .then(function (weatherAPIResponse) {
        
        console.log(queryURL);
        console.log(weatherAPIResponse);

        $("#weatherAPITemp").text(weatherAPIResponse.main.temp);
        $("#weatherAPICondition").text(weatherAPIResponse.weather[0].main);
        $("#weatherAPIIcon").html('<img src="http://openweathermap.org/img/w/' + weatherAPIResponse.weather[0].icon + '.png">');

    });