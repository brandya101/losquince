var map;
var locationInput = "";
var typeInput = "";
var startMapCenter = new google.maps.LatLng(37.09024,-95.71289100000001);
var address
var resultsZone = $('#display-objects');
var resultZoneTwo = $('#left-side');
resultsZone.on('click', '#pinned_bizzcard', function() {
  $(this).appendTo('#left-side');
  add();
  console.log($('#thumbnailimg').val().trim());
});
$(document).on('click', '#dltbutton', function() {
  event.stopPropagation();
  $(this).parent().remove();
});
var config = {
    apiKey: "AIzaSyDySxl4tmVSfwD-w-iNGKxxBD66k0psqJE",
    authDomain: "quince-a8fc2.firebaseapp.com",
    databaseURL: "https://quince-a8fc2.firebaseio.com",
    projectId: "quince-a8fc2",
    storageBucket: "quince-a8fc2.appspot.com",
    messagingSenderId: "239459287983"
  };
  firebase.initializeApp(config);
  var database = firebase.database();
  

//Added an extra button BA
function appendHTML(img , name , address, phone , rating ) {
  var businessCard = "";
  businessCard += "<div class='container' id='pinned_bizzcard'>"
  businessCard += "<button class='btn btn-primary dlt_btn' id='dltbutton' type='button'>Delete</button>"
  businessCard += "<button class='btn btn-danger ' id='addButton' type='button'>Add</button>"
  businessCard += "<img id='thumbnailimg' src=" + img + ">"
  businessCard += "<div class='card-body textWrap'>"
  businessCard += "<h5 id='BizzName'>" + name + "</h5>"
  businessCard += "<p class='card-text' id='address1'>Address:" + address + "</p>"
  businessCard += "<p class='card-text' id='phoneNumber1'>Phone Number:" + phone + "</p>"
  businessCard += "<p class='card-text' id='rating1'>Ratings:" + rating + "</p>"
  businessCard += "</div>"
  businessCard += "</div>"
  $("#leftSection").append(businessCard);

  //Added a button to move an item from one to the other. BA  
  $("#addButton").on('click',function(){
      $(this).parent().appendTo('.bizzCard');
  })

  var infotoSend = $(".bizzCard").val();

  console.log(infotoSend);

  $(businessCard).on('click', '#dltbutton', function() {
    console.log("hi");
    $(this).parent().remove();
  });
};




function initialize() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: startMapCenter,
    zoom: 3.5
  });
};
function runQuery() {
  locationInput = $("#location").val().trim();
  typeInput = $("#search").val().trim();
  console.log(typeInput);
  console.log(locationInput);
};
$("#userInputButton").on("click", function() {
  event.preventDefault();
  runQuery();
  // starts the api call
  var geocoder = new google.maps.Geocoder();
  var address = locationInput;
  var queryLatLng = "";
  var ipPass = "";
  var photoRef = "";
  if (geocoder) {
    geocoder.geocode({ 'address': address }, function (results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        // grabbing the lat and lng that come back from the geocoder api and logging them to console
        console.log(results[0].geometry.location.lat());
        console.log(results[0].geometry.location.lng());
        // defining the variable as the latlng in the right format to sent to the places api
        queryLatLng = new google.maps.LatLng(results[0].geometry.location.lat(),results[0].geometry.location.lng());
      }
      else {
        console.log("Geocoding failed: " + status);
      }
      // this is when the map will chang based on search location
      mapAdjust();
      // start of the places api query
      var request = {
        location: queryLatLng,
        radius: '5000',
        keyword: [ typeInput ]
      };
      service = new google.maps.places.PlacesService(map);
      service.nearbySearch(request, callback);
      function callback(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < results.length; i++) {
            var place = results[i];
            createMarker(results[i]);
            console.log(results[i]);
            idPass = results[i].place_id;
            console.log(idPass);
            function detailsCall() {
              var request = {
                placeId: idPass
              };
              service = new google.maps.places.PlacesService(map);
              service.getDetails(request, callback);
              function callback(resultsTwo, status) {
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                  console.log(resultsTwo);
                  console.log(resultsTwo.photos[0].getUrl({"maxWidth":300,"minWidth":300}));
                  console.log(resultsTwo.name);
                  console.log(resultsTwo.formatted_address);
                  console.log(resultsTwo.formatted_phone_number);
                  console.log(resultsTwo.rating);
                  // function appendHTML(img , name , phone , rating )
                  appendHTML(resultsTwo.photos[0].getUrl({"maxWidth":200,"minWidth":200}) , resultsTwo.name , resultsTwo.formatted_address , resultsTwo.formatted_phone_number , resultsTwo.rating)
                  name=resultsTwo.name;
                  address=resultsTwo.formatted_address;
                  phone=resultsTwo.formatted_phone_number;
                  rating = resultsTwo.rating;
                
                  var data = {
                    Name: resultsTwo.name,
                    Address: resultsTwo.formatted_address,
                    Phone : resultsTwo.formatted_phone_number,
                    Rating: resultsTwo.rating,            
                    dateAdded: firebase.database.ServerValue.TIMESTAMP
                    }
                    database.ref().push(data);
                 
                }
              }
            };
            detailsCall();
          }
        }
      }
      function mapAdjust() {
        map = new google.maps.Map(document.getElementById('map'), {
          center: queryLatLng,
          zoom: 13
        });
      };
      function createMarker(place) {
        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
          map: map,
          position: place.geometry.location
        });
      };
    });
  }
});
google.maps.event.addDomListener(window, 'load', initialize);
//  firebase

database.ref().orderByChild("dateAdded").limitToLast(5).on("child_added",  function(snapshot){

	console.log(snapshot.val().Name);
	console.log(snapshot.val().Address);
	console.log(snapshot.val().Phone);
    console.log(snapshot.val().Rating);
    console.log(snapshot.val().dateAdded);

   
    var businessCard = "";
    businessCard += "<div class='container' id='pinned_bizzcard'>"
    businessCard += "<button class='btn btn-primary dlt_btn' id='dltbutton' type='button'>Delete</button>"
    businessCard += "<button class='btn btn-danger ' id='addButton' type='button'>Add</button>"
    businessCard += "<div class='card-body textWrap'>"
    businessCard += "<h5 id='BizzName'>" + snapshot.val().Name + "</h5>"
    businessCard += "<p class='card-text' id='address1'>Address:" + snapshot.val().Address + "</p>"
    businessCard += "<p class='card-text' id='phoneNumber1'>Phone Number:" + snapshot.val().Phone + "</p>"
    businessCard += "<p class='card-text' id='rating1'>Ratings:" + snapshot.val().Rating + "</p>"
    businessCard += "</div>"
    businessCard += "</div>"
    $("#leftSection").append(businessCard);

    //Added a button to move an item from one to the other. BA  
    $("#addButton").on('click',function(){
        $(this).parent().appendTo('.bizzCard');
    })

    $(businessCard).on('click', '#dltbutton', function() {
    $(this).parent().remove();
    });

    }, function(errorObject){
        console.log("Errors Handled: " + errorObject.code);
    });

