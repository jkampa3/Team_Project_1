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

$("#modalSummitButton").on("click", function (event) {

    event.preventDefault();

    userSearchLocation = $("#formCityZipInput").val().trim();

    database.ref().push({
        location: userSearchLocation
    });

});

database.ref().on("child_added", function (childSnapshot, prevChildKey) {

    var userSearchLocation = childSnapshot.val().location;

    console.log(userSearchLocation);

});