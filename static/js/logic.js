// Url
var earthquakesURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"


// Initialize & Create Two Separate LayerGroups: earthquakes 
var earthquakes = new L.LayerGroup();

// Define Variables for Tile Layers

var grayscaleMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });



// Define a baseMaps object to hold our base layers
var baseMaps = {
    "Grayscale": grayscaleMap
};

// Create Overlay Object to Hold Overlay Layers
var overlayMaps = {
    "Earthquakes": earthquakes,
};

// Create our map, giving it the streetmap and earthquakes layers to display on load
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 2,
    layers: [grayscaleMap, earthquakes]
});

// Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
L.control.layers(baseMaps, overlayMaps).addTo(myMap);

// GeoJSON Data with D3
d3.json(earthquakesURL, function(data) {
    console.log(data)
    // Function to Determine Size of Marker Based on the Magnitude of the Earthquake
    function markerSize(magnitude) {
        if (magnitude === 0) {
          return 1;
        }
        return magnitude * 3;
    }
    // Function to Determine Style of Marker Based on the Magnitude of the Earthquake
    function circle(feature) {
        return {
          opacity: 1,
          fillOpacity: 1,
          fillColor: chooseColor(feature.properties.mag),
          color: "#000000",
          radius: markerSize(feature.properties.mag),
          stroke: true,
          weight: 0.5
        };
    }
    // Function to Determine Color of Marker Based on the Magnitude of the Earthquake
    function chooseColor(magnitude) {
        switch (true) {
        case magnitude > 5:
            return "#581845";
        case magnitude > 4:
            return "#900C3F";
        case magnitude > 3:
            return "#C70039";
        case magnitude > 2:
            return "#FF5733";
        case magnitude > 1:
            return "#FFC300";
        default:
            return "#DAF7A6";
        }
    }
    // Create a GeoJSON Layer Containing the Features Array on the Data Object
    L.geoJSON(data, {
        pointToLayer: function(feature, location) {
            return L.circleMarker(location);
        },
        style: circle,
        // Function to Run Once For Each feature in the features Array
        onEachFeature: function(feature, layer) {
            layer.bindPopup("<h4>Location: " + feature.properties.place + "</p><hr><p>Magnitude: " + feature.properties.mag + "</p>");
        }
    // Add Data to earthquakes LayerGroups 
    }).addTo(earthquakes);
    // Add earthquakes Layer to the Map
    earthquakes.addTo(myMap);
});