var $ = require("jquery");
require("component-leaflet-map");
var d3 = require('d3');
require("./lib/leaflet-heat.js");

// setting sizes of interactive features
var bar_spacing = 0.2;
var margin = {
  top: 15,
  right: 15,
  bottom: 25,
  left: 40
};
var normalize = 2623*10;

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
  map.setView(new L.LatLng(37.75, -122.43), 11);
} else {
  map.setView(new L.LatLng(37.77, -122.44), 13);
}
map.scrollWheelZoom.disable();

var latlongs2010 = [];
var latlongs2011 = [];
var latlongs2012 = [];
var latlongs2013 = [];
var latlongs2014 = [];
var latlongs2015 = [];

taxData.forEach(function(tax) {
  latlongs2010.push([tax.AddressFrom_Lat,tax.AddressFrom_Lon,tax.yr2010/normalize]);
  latlongs2010.push([tax.AddressTo_Lat,tax.AddressTo_Lon,tax.yr2010/normalize]);

  latlongs2011.push([tax.AddressFrom_Lat,tax.AddressFrom_Lon,tax.yr2011/normalize]);
  latlongs2011.push([tax.AddressTo_Lat,tax.AddressTo_Lon,tax.yr2011/normalize]);

  latlongs2012.push([tax.AddressFrom_Lat,tax.AddressFrom_Lon,tax.yr2012/normalize]);
  latlongs2012.push([tax.AddressTo_Lat,tax.AddressTo_Lon,tax.yr2012/normalize]);

  latlongs2013.push([tax.AddressFrom_Lat,tax.AddressFrom_Lon,tax.yr2013/normalize]);
  latlongs2013.push([tax.AddressTo_Lat,tax.AddressTo_Lon,tax.yr2013/normalize]);

  latlongs2014.push([tax.AddressFrom_Lat,tax.AddressFrom_Lon,tax.yr2014/normalize]);
  latlongs2014.push([tax.AddressTo_Lat,tax.AddressTo_Lon,tax.yr2014/normalize]);

  latlongs2015.push([tax.AddressFrom_Lat,tax.AddressFrom_Lon,tax.yr2015/normalize]);
  latlongs2015.push([tax.AddressTo_Lat,tax.AddressTo_Lon,tax.yr2015/normalize]);
});

var looping = true;
var heat = L.heatLayer();

var drawMap = function(selected_year,latlongsData) {

  console.log(heat);
  if (heat != null) {
    console.log("we are removing the heat layer now");
    heat.removeFrom(map);
  }
  // $(".leaflet-heatmap-layer").removeFrom(map);

  var duration = 700;
  // map.on("viewreset",update);

  var heat = L.heatLayer(latlongsData, {
      radius: 6,
      blur: 10
    }).addTo(map)

  console.log(heat);

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
