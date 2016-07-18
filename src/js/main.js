var $ = require("jquery");
require("component-leaflet-map");
require("./lib/leaflet-heat.js");

// setting sizes of interactive features
var bar_spacing = 0.2;
var margin = {
  top: 15,
  right: 15,
  bottom: 25,
  left: 40
};
// biggest number is: , smallest number is:
if (screen.width <= 480) {
  var normalize = 60000;
  var radius_val = 4;
  var blur_val = 6;
} else {
  var normalize = 60000;
  var radius_val = 6;
  var blur_val = 10;
}

// var inflation_multipliers = [108.70, 105.37, 103.23, 101.74, 100.12, 100];

//get access to Leaflet and the map
var element = document.querySelector("leaflet-map");
var L = element.leaflet;
var map = element.map;

// Disable drag and zoom handlers.
map.dragging.disable();
map.touchZoom.disable();
map.doubleClickZoom.disable();
map.scrollWheelZoom.disable();
map.keyboard.disable();

if (screen.width <= 480) {
  map.setView(new L.LatLng(37.76, -122.43), 11);
} else {
  map.setView(new L.LatLng(37.765, -122.445), 13);
}
map.scrollWheelZoom.disable();

var latlongs2010 = [];
var latlongs2011 = [];
var latlongs2012 = [];
var latlongs2013 = [];
var latlongs2014 = [];
var latlongs2015 = [];

taxData.forEach(function(tax) {
  latlongs2010.push([tax.AddressFrom_Lat,tax.AddressFrom_Lon,tax.norm2010/normalize]);
  latlongs2010.push([tax.AddressTo_Lat,tax.AddressTo_Lon,tax.norm2010/normalize]);

  latlongs2011.push([tax.AddressFrom_Lat,tax.AddressFrom_Lon,tax.norm2011/normalize]);
  latlongs2011.push([tax.AddressTo_Lat,tax.AddressTo_Lon,tax.norm2011/normalize]);

  latlongs2012.push([tax.AddressFrom_Lat,tax.AddressFrom_Lon,tax.norm2012/normalize]);
  latlongs2012.push([tax.AddressTo_Lat,tax.AddressTo_Lon,tax.norm2012/normalize]);

  latlongs2013.push([tax.AddressFrom_Lat,tax.AddressFrom_Lon,tax.norm2013/normalize]);
  latlongs2013.push([tax.AddressTo_Lat,tax.AddressTo_Lon,tax.norm2013/normalize]);

  latlongs2014.push([tax.AddressFrom_Lat,tax.AddressFrom_Lon,tax.norm2014/normalize]);
  latlongs2014.push([tax.AddressTo_Lat,tax.AddressTo_Lon,tax.norm2014/normalize]);

  latlongs2015.push([tax.AddressFrom_Lat,tax.AddressFrom_Lon,tax.norm2015/normalize]);
  latlongs2015.push([tax.AddressTo_Lat,tax.AddressTo_Lon,tax.norm2015/normalize]);
});

var looping = true;

var drawMap = function(selected_year,latlongsData) {

  $( ".leaflet-heatmap-layer" ).each(function( index ) {
    $(this).remove();
  });

  var duration = 700;

  var heat = L.heatLayer(latlongsData, {
      radius: radius_val,
      blur: blur_val
    }).addTo(map)

}

// fills in HTML for year as years toggle
var updateInfo = function(year) {
		document.querySelector(".display-year").innerHTML = `<strong>${year}</strong>`;
};

var years = [2010,2011,2012,2013,2014,2015];
var i = 0;

var loop = null;
var tick = function() {
  if (years[i] == "2010") {
    var current_data = latlongs2010;
  } else if (years[i] == "2011") {
    var current_data = latlongs2011;
  } else if (years[i] == "2012") {
    var current_data = latlongs2012;
  } else if (years[i] == "2013") {
    var current_data = latlongs2013;
  } else if (years[i] == "2014") {
    var current_data = latlongs2014;
  } else {
    var current_data = latlongs2015;
  }

  drawMap(years[i],current_data);
  console.log(years[i]);
	updateInfo(years[i]);
  i = (i + 1) % years.length;
  loop = setTimeout(tick, i == 0 ? 1700 : 1000);
};

tick();

setTimeout( function(){
    // Do something after 1 second
    document.querySelector(".start").classList.remove("selected");
    document.querySelector(".pause").classList.add("selected");
    looping = false;
    clearTimeout(loop);
  }  , 60000 );

$("#mapoptions").click ( function() {
	barchart();
  document.querySelector(".start").classList.add("selected");
  document.querySelector(".pause").classList.remove("selected");
  looping = true;
});

document.querySelector(".start").addEventListener("click", function(e) {
  if (looping) { return }
  document.querySelector(".start").classList.add("selected");
  document.querySelector(".pause").classList.remove("selected");
  looping = true;
  tick();
});

document.querySelector(".pause").addEventListener("click", function(e) {
  if (!looping) { return }
  document.querySelector(".start").classList.remove("selected");
  document.querySelector(".pause").classList.add("selected");
  looping = false;
  clearTimeout(loop);
});
