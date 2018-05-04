$(document).ready(function () {

	//variables
	var ilat;
	var ilng;
	var googleapiKey = "AIzaSyBAhNxc8BbsIMC5tFTNUSADF8vhSiNxXmA";
	var iradius = 5000;
	var type = [];
	var locationURL;
	var bars = [];
	var restaurants = [];
	var gasplaces = [];
	var parking = [];
	var hotels = [];
	var map;
	var pyrmont;
	var selText
	var iconBar = "assets/images/bar.png";
	var iconParking = "assets/images/parking.png";
	var iconGas = "assets/images/gas.png";
	var iconHotel = "assets/images/lodging-2.png";
	var iconRestaurant = "assets/images/restaurant.png";
	var imageicon;


	//modal load function
	$("#myModal").modal();

	//modal submit function
	$("#modalSummitButton").on("click", function (e) {
		e.preventDefault();
		let cty = $('#formCityZipInput').val()
		let chckd = $('.checkboxChoices input[type="checkbox"]:checked');
		if ((chckd.length > 0) && (cty)) {
			$('#myModal').modal('hide');
			dumpInArray();
		} else {
			alert("Please enter a city name, and check at least (1) item.");
		}
		weatherAPICall();
	});


	//checkbox array for Google Search
	function dumpInArray() {
		$('.checkboxChoices input[type="checkbox"]:checked').each(function () {
			$('#myModal').modal('hide');
			type.push($(this).val());
		});
		console.log(type);
		mainProcess();
	}

	// When enters city & submits
	function mainProcess() {

		selText = $('#formCityZipInput').val();
		$('#formCityZipInputt').val("");
		locationURL = geocodeQueryBuild(selText);
		callgeocodeAPI(locationURL);
	};


	// function to build query URL and return
	function geocodeQueryBuild(input) {
		var queryURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + input + "&key=" + googleapiKey;
		return queryURL;
	};

	// This function calls the geocode API and gets lang & latt
	function callgeocodeAPI(queryURL) {
		$.ajax({
			url: queryURL,
			method: "GET",
		}).then(function (gecodeoResp) {

			ilat = parseFloat(gecodeoResp.results[0].geometry.location.lat);
			ilng = parseFloat(gecodeoResp.results[0].geometry.location.lng);
			initMap();
			for (var i = 0; i < type.length; i++) {
				serviceReq(type[i]);
			};

		});
	};
	// Initialyze google places call
	function initMap(lats, lngs, classType, name, address, rating) {

		pyrmont = {
			lat: ilat,
			lng: ilng
		};
		map = new google.maps.Map(document.getElementById('map'), {
			center: pyrmont,
			zoom: 14
		});

		if (typeof (lats) !== "undefined") {

			for (var i = 0; i < lats.length; i++) {
				var infoWindow = new google.maps.InfoWindow();

				let ltln = {
					lat: parseFloat(lats[i]),
					lng: parseFloat(lngs[i])
				}
				var nameE = name[i];
				var addressE = address[i];
				var ratingE = rating[i];
				var testing = 0
				//adding the icons onto the map of each type
				var classifications = classType[i];

				if (classifications === "restaurant") {
					imageicon = iconRestaurant;
				} else if (classifications === "bar") {
					imageicon = iconBar;
				} else if (classifications === "parking") {
					imageicon = iconParking;
				} else if (classifications === "hotel") {
					imageicon = iconHotel;
				} else if (classifications === "gas") {
					imageicon = iconGas;
				} else {
					alert("no match");
				}
				var windowInfo = "<p><strong>Name:</strong> " + name[i] + "</p>" +
					"<p><strong>Address:</strong> " + address[i] + "</p>" +
					"<p><strong>Rating:</strong> " + rating[i] + "</p>";

				var marker = new google.maps.Marker({
					position: ltln,
					map: map,
					icon: imageicon
				});
				marker.addListener('click', function () {
					infoWindow.setContent(windowInfo);
					infoWindow.open(map, marker);
				});

			}
		}
	}; //end of map

	// service request
	function serviceReq(itype) {
		var service = new google.maps.places.PlacesService(map);
		var request = {
			location: pyrmont,
			radius: iradius,
			query: [itype]
		}
		service.textSearch(request, fecthrespFacory(itype));
	}
	// fetch response
	function fecthrespFacory(itype) {
		return function (results, status) {
			if (status === google.maps.places.PlacesServiceStatus.OK) {
				console.log(results);
				var place_title;
				var place_address;
				var place_lan;
				var place_lat;
				var place_id;
				var placeobj;

				// Save each result item object and their necessary properties
				for (var j = 0; j < results.length; j++) {
					place_title = results[j].name;
					place_id = results[j].place_id;
					place_address = results[j].formatted_address;
					place_lat = results[j].geometry.location.lat();
					place_lng = results[j].geometry.location.lng();
					place_rating = results[j].rating;

					placeobj = {
						"title": place_title,
						"place_id": place_id,
						"address": place_address,
						"lat": place_lat,
						"lng": place_lng,
						"rating": place_rating
					};
					switch (itype) {
						case "bars":
							bars.push(placeobj);
							break;
						case "parking":
							parking.push(placeobj);
							break;
						case "lodging":
							hotels.push(placeobj);
							break;
						case "restaurants":
							restaurants.push(placeobj);
							break;
						case "gas_station":
							gasplaces.push(placeobj);
							break;
					};
				};
				switch (itype) {
					case "bars":
						barGen(bars);
						break;
					case "parking":
						parkGen(parking);
						break;
					case "lodging":
						hotGen(hotels);
						break;
					case "restaurants":
						restGen(restaurants);
						break;
					case "gas_station":
						gasGen(gasplaces);
						break;
				};
			}
		}
	}

	function restGen(obj) {
		console.log(obj);
		let count = 1;
		for (var x = 0; x < 5; x++) {
			let p = $("<p>");
			let inp = $("<input>");
			inp.attr("data-", "restaurant");
			inp.attr("data-rating", obj[x].rating);
			inp.attr("data-name", obj[x].title);
			inp.attr("data-address", obj[x].address);
			inp.attr("type", "checkbox");
			inp.attr("class", "chkinpt");
			inp.attr("data-lat", obj[x].lat);
			inp.attr("data-lng", obj[x].lng);
			p.prepend(inp);
			p.append(" " + count++ + ". " + obj[x].title);
			p.attr("class", "col-sm results");
			$("#restaurant").append(p);
		}
	}

	function barGen(obj) {
		let count = 1;
		for (var x = 0; x < 5; x++) {
			let p = $("<p>");
			let inp = $("<input>");
			inp.attr("data-", "bar");
			inp.attr("data-rating", obj[x].rating);
			inp.attr("data-name", obj[x].title);
			inp.attr("data-address", obj[x].address);
			inp.attr("type", "checkbox");
			inp.attr("class", "chkinpt");
			inp.attr("data-lat", obj[x].lat);
			inp.attr("data-lng", obj[x].lng);
			p.prepend(inp);
			p.append(" " + count++ + ". " + obj[x].title);
			p.attr("class", "col-sm results");
			$("#bars").append(p);
		}

	}
	function parkGen(obj) {
		let count = 1;
		for (var x = 0; x < 5; x++) {
			let p = $("<p>");
			let inp = $("<input>");
			inp.attr("data-", "parking");
			inp.attr("data-rating", obj[x].rating);
			inp.attr("data-name", obj[x].title);
			inp.attr("data-address", obj[x].address);
			inp.attr("type", "checkbox");
			inp.attr("class", "chkinpt");
			inp.attr("data-lat", obj[x].lat);
			inp.attr("data-lng", obj[x].lng);
			p.prepend(inp);
			p.append(" " + count++ + ". " + obj[x].title);
			p.attr("class", "col-sm results");
			$("#parking").append(p);
		}

	}
	function hotGen(obj) {
		let count = 1;
		for (var x = 0; x < 5; x++) {
			let p = $("<p>");
			let inp = $("<input>");
			inp.attr("data-", "hotel");
			inp.attr("data-rating", obj[x].rating);
			inp.attr("data-name", obj[x].title);
			inp.attr("data-address", obj[x].address);
			inp.attr("type", "checkbox");
			inp.attr("class", "chkinpt");
			inp.attr("data-lat", obj[x].lat);
			inp.attr("data-lng", obj[x].lng);
			p.prepend(inp);
			p.append(" " + count++ + ". " + obj[x].title);
			p.attr("class", "col-sm results");
			$("#hotel").append(p);
		}
	}

	function gasGen(obj) {
		console.log(obj, "gas object")
		let count = 1;
		let id = 0;
		for (var x = 0; x < 5; x++) {
			let p = $("<p>");
			let inp = $("<input>");
			inp.attr("data-", "gas");
			inp.attr("data-rating", obj[x].rating);
			inp.attr("data-name", obj[x].title);
			inp.attr("data-address", obj[x].address);
			inp.attr("type", "checkbox");
			inp.attr("class", "chkinpt");
			inp.attr("data-lat", obj[x].lat);
			inp.attr("data-lng", obj[x].lng);
			p.prepend(inp);
			p.append(" " + count++ + ". " + obj[x].title);
			p.attr("class", "col-sm results");
			$("#gas").append(p);
		}
	}
	$("#mapSub").on("click", function (e) {
		e.preventDefault();
		var lats = [];
		var longs = [];
		var classType = [];
		var name = [];
		var address = [];
		var rating = [];
		$('#checked input[type="checkbox"]:checked').each(function () {
			lats.push($(this).attr("data-lat"));
		});
		$('#checked input[type="checkbox"]:checked').each(function () {
			longs.push($(this).attr("data-lng"));
		})
		$('#checked input[type="checkbox"]:checked').each(function () {
			classType.push($(this).attr("data-"));
		})
		$('#checked input[type="checkbox"]:checked').each(function () {
			name.push($(this).attr("data-name"));
		})
		$('#checked input[type="checkbox"]:checked').each(function () {
			address.push($(this).attr("data-address"));
		})
		$('#checked input[type="checkbox"]:checked').each(function () {
			rating.push($(this).attr("data-rating"));
		})


		if (lats.length > 0) {
			initMap(lats, longs, classType, name, address, rating);
		}
	});

});