//firebase call
var config = {
    apiKey: "AIzaSyAKWwMWzp2OojY0KkBmlKLt0FxQtNrH7CE",
    authDomain: "group-project-1-e9b84.firebaseapp.com",
    databaseURL: "https://group-project-1-e9b84.firebaseio.com",
    projectId: "group-project-1-e9b84",
    storageBucket: "group-project-1-e9b84.appspot.com",
    messagingSenderId: "1009724139282"
};
firebase.initializeApp(config);

//variable
var database = firebase.database();
var userSearchLocation = "";
var userSearchDistance = "";
var userSearchSeletions = "";

$("#modalSummitButton").on("click", function (event) {

    event.preventDefault();

    userSearchLocation = $("#formCityZipInput").val().trim();
    userSearchDistance = $("#formDistanceInput").val().trim();
    userSearchSeletions = array2StringFB();

    database.ref().push({
        location: userSearchLocation,
        distance: userSearchDistance,
        selection: userSearchSeletions,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });

});

database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function (snapshot) {

    var latestEntry = snapshot.val();

    //console.log(latestEntry.location);
    //console.log(latestEntry.distance);
    //console.log(latestEntry.selection);

    //$("#searchedCity").text(latestEntry.location);

    $("#firebaseLocation").text(latestEntry.location);
    $("#firebaseDistance").text((latestEntry.distance) / 1000);
    $("#firebaseSelection0").text(latestEntry.selection[0]);
    $("#firebaseSelection1").text(latestEntry.selection[1]);
    $("#firebaseSelection2").text(latestEntry.selection[2]);
    $("#firebaseSelection3").text(latestEntry.selection[3]);
    $("#firebaseSelection4").text(latestEntry.selection[4]);

}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);

});

function array2StringFB() {
    var userSearchSeletionsArray = [];
    $('.checkboxChoices input[type="checkbox"]:checked').each(function () {
        userSearchSeletionsArray.push($(this).val());
    });
    //userSearchSeletionsArray.toString();
    //console.log("String: " + userSearchSeletionsArray.toString());
    //return userSearchSeletionsArray.toString();
    return userSearchSeletionsArray;
}