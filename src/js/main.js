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

var latlngs = [];
taxData.foreach(function(tax) {
  latlongs.push([tax.AddressFrom_Lat,tax.AddressFrom_Lat, tax.yr2010]);
  latlongs.push([tax.AddressTo_Lat,tax.AddressTo_Lat, tax.yr2010]);
});

// var looping = true;

var heat = L.heatLayer([
    [37.75, -122.43, 0.5], // lat, lng, intensity
    [37.75, -122.44, 10]
], {
    radius: 30,
    blur: 15
  }).addTo(map)

console.log(heat);
