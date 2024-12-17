console.log("logic.js connected!");

let myMap = L.map("map", {
    center: [37.09, -95.71], // Center of the US
    zoom: 4 // Zoom level
});

// Adding a tile layer (the background map image) to our map

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
}).addTo(myMap);

const geojsonURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Fetch the GeoJSON data
d3.json(geojsonURL).then(function(data) {
    console.log("Earthquake Data: ", data);

    // Add GeoJSON layer with customized markers
    L.geoJson(data, {
        // Use pointToLayer to create circle markers
        pointToLayer: function(feature, latlng) {
            let magnitude = feature.properties.mag;
            let depth = feature.geometry.coordinates[2];

            // Style for circle markers
            return L.circleMarker(latlng, {
                radius: magnitude * 4, // Size reflects magnitude
                fillColor: getColor(depth), // Color reflects depth
                color: "#000",
                weight: 0.5,
                opacity: 1,
                fillOpacity: 0.75
            });
        },
        // Add popups to each marker
        onEachFeature: function(feature, layer) {
            layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3>
                             <hr>
                             <p>Magnitude: ${feature.properties.mag}</p>
                             <p>Depth: ${feature.geometry.coordinates[2]} km</p>`);
        }
    }).addTo(myMap);
});

// Function to determine marker color based on depth
function getColor(depth) {
    return depth > 90 ? "#ff0000" : // Red
           depth > 70 ? "#ff6600" : // Orange
           depth > 50 ? "#ffcc00" : // Yellow
           depth > 30 ? "#ccff33" : // Light green
                        "#33ff33";  // Green
}
// Create a legend control object
let legend = L.control({ position: "bottomright" });

legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend");
    const depths = [-10, 10, 30, 50, 70, 90]; // Depth intervals
    const colors = ["#33ff33", "#ccff33", "#ffcc00", "#ff6600", "#ff0000"];

    // Loop through depth intervals to generate legend labels
    for (let i = 0; i < depths.length; i++) {
        div.innerHTML +=
            `<i style="background: ${colors[i]}"></i> ` +
            `${depths[i]}${depths[i + 1] ? "&ndash;" + depths[i + 1] + " km<br>" : "+ km"}`;
    }
    return div;
};

// Add the legend to the map
legend.addTo(myMap);
