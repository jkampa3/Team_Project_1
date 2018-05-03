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
var userSearchSeletions = [];

$("#modalSummitButton").on("click", function (event) {

    event.preventDefault();

    userSearchLocation = $("#formCityZipInput").val().trim();
    userSearchDistance = $("#formDistanceInput").val().trim();
    //userSearchSeletions = $('.checkboxChoices input[type="checkbox"]:checked').each(function () {
    //     userSearchSeletions.push($(this).val());
    // });

    database.ref().push({
        location: userSearchLocation,
        distance: userSearchDistance,
        //selection: userSearchSeletions,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });

});

database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function (snapshot) {

    var latestEntry = snapshot.val();

    console.log(latestEntry.location);
    console.log(latestEntry.distance);
    //Selection

});