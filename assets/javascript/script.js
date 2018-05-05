$(document).ready(function () {

	//variables
	var ilat;
	var ilng;
	var googleapiKey = "AIzaSyBAhNxc8BbsIMC5tFTNUSADF8vhSiNxXmA";
	var iradius;
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
	var lats = [];
	var longs = [];
	var classType = [];
	var name = [];
	var address = [];
	var rating = [];
	var counter = 0;
	var placeURL = [];
	var placeimg = [];
	var placecontact = [];


	//modal on page load function
	$("#myModalPageLoad").modal();

	//modal form submit function
	$("#modalSummitButton").on("click", function (e) {
		e.preventDefault();
		iradius = $("#formDistanceInput").val();
		let cty = $('#formCityZipInput').val()
		let chckd = $('.checkboxChoices input[type="checkbox"]:checked');
		if ((chckd.length > 0) && (cty)) {
			$("#myModalPageLoad").modal('hide');
			dumpInArray();
			$("#mainPageID").removeClass("divHidden");
		} else {
			//alert("Please enter a city name, and check at least (1) item.");
			$("#myModalAlert").modal('toggle');
			$("#myModalAlert").addClass("animated zoomIn");
		}
		weatherAPICall();
	});

	//modal form close function
	$("#modalCloseButton").on("click", function (e) {
		$("#myModalPageLoad").modal('hide');
		$("#myModalPageLoad").addClass("animated fadeOutDownBig");
		$("#myModalReload").modal('toggle');

	});

	//modal reload
	$("#modalReloadButton").on("click", function (e) {
		$("#myModalReload").modal('hide');
		$("#myModalRelaod").addClass('animated fadeOutDownBig');
		//idea here: reload page load modal
		//current bug: show/toggle wasn't working, just reload page and modal goes by
		//$("#myModalPageLoad").modal('show');
		location.reload();
	});

	//close webpage
	$("#modalReloadCloseButton").on("click", function (e) {
		//current bug: works only half the time
		window.close();
	});

	//search Reload
	$("#searchReloadButton").on("click", function (e) {
		//idea here: reload previous search:
		//current bug: issue with .empty
		//$("#mainPageID").addClass("divHidden");
		//$("#restaurant").empty();
		//$("#bars").empty();
		//$("#gas").empty();
		//$("#parking").empty();
		//$("#hotel").empty();
		//$("#myModalPageLoad").modal();
		location.reload();
	});

	//checkbox array for Google Search
	function dumpInArray() {
		$('.checkboxChoices input[type="checkbox"]:checked').each(function () {
			$("#myModalPageLoad").modal('hide');
			type.push($(this).val());
		});
		console.log(type);
		mainProcess();
	};

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
	function initMap(lats, lngs, classType, name, address, rating, placeURL, placeimg, placecontact) {

		pyrmont = {
			lat: ilat,
			lng: ilng
		};
		map = new google.maps.Map(document.getElementById('map'), {
			center: pyrmont,
			zoom: 11,
			mapTypeId: 'terrain'
		});

		if (typeof (lats) !== "undefined") {

			for (var i = 0; i < lats.length; i++) {
				let ltln = {
					lat: parseFloat(lats[i]),
					lng: parseFloat(lngs[i])
				}

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

				infoData(name[i], address[i], rating[i], ltln, placeURL[i], placecontact[i], placeimg[i]);
			}//for loop

			function infoData(name, address, rating, ltln, placeURL, placecontact, placeimg) {
				console.log(placeimg);
				var windowInfo = '<img class="floatleft" src="' + placeimg + '">' +
					'<p class="infoWindow"><strong>Name:</strong>' + name + '<br>' +
					'<strong>Address:</strong> ' + address + "<br>" +
					'<strong>Website:</strong><a href="' + placeURL + '" target="_blank">' + 'Link here' + '</a>' + '<br>' +
					'<strong>Contact:</strong> ' + placecontact + '<br>' +
					'<strong>Rating:</strong> ' + rating + '</p>';

				var infoWindow = new google.maps.InfoWindow({
					maxWidth: 300
				});
				var marker = new google.maps.Marker({
					position: ltln,
					map: map,
					icon: imageicon
				});
				marker.addListener('click', function () {

					infoWindow.setContent(windowInfo);
					infoWindow.open(map, marker);
					infoWindow.maxWidth(300);
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
	};

	// fetch response
	function fecthrespFacory(itype) {
		return function (results, status) {
			if (status === google.maps.places.PlacesServiceStatus.OK) {

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
						"rating": place_rating,

					};
					switch (itype) {
						case "bars":
							bars.push(placeobj);
							break;
						case "parking":
							parking.push(placeobj);
							break;
						case "hotels":
							hotels.push(placeobj);
							break;
						case "restaurants":
							restaurants.push(placeobj);
							break;
						case "gas station":
							gasplaces.push(placeobj);
							break;
					};
				};
				switch (itype) {
					case "bars":
						bars.sort(function (a, b) {
							return b.rating - a.rating;
						});
						barGen(bars);
						break;
					case "parking":
						parking.sort(function (a, b) {
							return b.rating - a.rating;
						});
						parkGen(parking);
						break;
					case "hotels":
						hotels.sort(function (a, b) {
							return b.rating - a.rating;
						});
						hotGen(hotels);
						break;
					case "restaurants":
						restaurants.sort(function (a, b) {
							return b.rating - a.rating;
						});
						restGen(restaurants);
						break;
					case "gas station":
						gasplaces.sort(function (a, b) {
							return b.rating - a.rating;
						});
						gasGen(gasplaces);
						break;
				};
			}
		}
	};

	function restGen(obj) {
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
			inp.attr("place_id", obj[x].place_id);
			p.prepend(inp);
			p.append(" " + count++ + ". " + obj[x].title);
			p.attr("class", "col-sm results");
			$("#restaurant").append(p);
		}
	};

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
			inp.attr("place_id", obj[x].place_id);
			p.prepend(inp);
			p.append(" " + count++ + ". " + obj[x].title);
			p.attr("class", "col-sm results");
			$("#bars").append(p);
		}

	};

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
			inp.attr("place_id", obj[x].place_id);
			p.prepend(inp);
			p.append(" " + count++ + ". " + obj[x].title);
			p.attr("class", "col-sm results");
			$("#parking").append(p);
		}

	};

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
			inp.attr("place_id", obj[x].place_id);
			p.prepend(inp);
			p.append(" " + count++ + ". " + obj[x].title);
			p.attr("class", "col-sm results");
			$("#hotel").append(p);
		}
	};

	function gasGen(obj) {
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
			inp.attr("place_id", obj[x].place_id);
			p.prepend(inp);
			p.append(" " + count++ + ". " + obj[x].title);
			p.attr("class", "col-sm results");
			$("#gas").append(p);
		}
	};

	$("#mapSub").on("click", function (e) {
		e.preventDefault();
		lats = [];
		longs = [];
		classType = [];
		name = [];
		address = [];
		rating = [];
		placeimg = [];
		placecontact = [];
		placeURL = [];
		counter = 0;
		$('#checked input[type="checkbox"]:checked').each(function () {
			lats.push($(this).attr("data-lat"));
			longs.push($(this).attr("data-lng"));
			classType.push($(this).attr("data-"));
			name.push($(this).attr("data-name"));
			address.push($(this).attr("data-address"));
			rating.push($(this).attr("data-rating"));
			counter = lats.length - 1;
			var request = {
				placeId: $(this).attr("place_id")
			}
			console.log(request);
			var service = new google.maps.places.PlacesService(map);
			service.getDetails(request, getplacedetails(lats, longs, classType, name, address, rating, placeURL, placeimg, placecontact, counter));
		});
	});

	// This gets details for each place ID ( Website address, phone number & image on clikc only)
	function getplacedetails(lats, longs, classType, name, address, rating, placeURL, placeimg, placecontact, counter) {
		return function (place, status) {
			if (status == google.maps.places.PlacesServiceStatus.OK) {
				placeURL[counter] = place.website;
				placecontact[counter] = place.formatted_phone_number;
				placeimg[counter] = place.photos[0].getUrl({ 'maxWidth': 100, 'maxHeight': 100 });
				console.log(placeimg, placecontact, placeURL);
				initMap(lats, longs, classType, name, address, rating, placeURL, placeimg, placecontact);
			}
		}
	};

});