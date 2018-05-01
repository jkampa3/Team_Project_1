//modal call function

$(document).ready(function () {
    $("#myModal").modal();
});

//modal submit function

$("#modalSummitButton").on("click", function(e) {
    e.preventDefault();
    $('#myModal').modal('hide');
});


//momentJS

var datetime = null,
    date = null;

var update = function () {
    date = moment(new Date())
    datetime.html(date.format('MMM Do YYYY, h:mm a'));
};

$(document).ready(function () {
    datetime = $('#currentTimeDate')
    update();
    setInterval(update, 1000);
});