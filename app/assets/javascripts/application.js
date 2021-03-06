// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require foundation
//= require turbolinks
//= require react
//= require react_ujs
//= require components
//= require_tree .
//= require foundation

$(document).ready(function() {

  $('.modal').on('hidden.bs.modal', function(){
    $("iframe").each(function() {
            var src= $(this).attr('src');
            $(this).attr('src',src);
    });
  });

});

$(function(){ $(document).foundation(); });

var totalDist;
var map;
function initMap() {
  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer;
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 6,
    center: {lat: 41.85, lng: -87.65}
  });
  directionsDisplay.setMap(map);

  calculateAndDisplayRoute(directionsService, directionsDisplay);
  // document.getElementById('submit').addEventListener('click', function() {
    // calculateAndDisplayRoute(directionsService, directionsDisplay);
  // });
}

function calculateAndDisplayRoute(directionsService, directionsDisplay) {
  var waypts = [];
  var waypointsArr = JSON.parse($('#waypoints').html());
  console.log(waypointsArr);
  for (var i = 2; i < waypointsArr.length; i++) {
    waypts.push({
      location: waypointsArr[i],
      stopover: true
    });
  }

  directionsService.route({
    origin: $('#startLoc').html(),
    destination: $('#endLoc').html(),
    waypoints: waypts,
    optimizeWaypoints: true,
    travelMode: google.maps.TravelMode.DRIVING
  }, function(response, status) {
    totalDist = response.routes[0].legs.reduce(function (prev, curr) {
      return prev + curr.distance.value
    }, 0)
    totalDist = totalDist*0.000621371
    console.log(totalDist);
    if (status === google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
      var route = response.routes[0];
      // // var summaryPanel = document.getElementById('directions-panel');
      // summaryPanel.innerHTML = '';
      // For each route, display summary information.
      // for (var i = 0; i < route.legs.length; i++) {
      //   var routeSegment = i + 1;
      //   summaryPanel.innerHTML += '<b>Route Segment: ' + routeSegment +
      //       '</b><br>';
      //   summaryPanel.innerHTML += route.legs[i].start_address + ' to ';
      //   summaryPanel.innerHTML += route.legs[i].end_address + '<br>';
      //   summaryPanel.innerHTML += route.legs[i].distance.text + '<br><br>';
      // }
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
}
