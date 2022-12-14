export const displayMap = (locations) => {
mapboxgl.accessToken = 'pk.eyJ1IjoiaGFpbTAxIiwiYSI6ImNsOXhndWx5dzBhMnYzd3VyZW43d2F1N2MifQ.8A-qxkNvz54KO4enfE2pyQ';

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/haim01/cl9xibtt2003n14o6nnip9gwr', // style URL
    center: [-74.5, 40], // starting position [lng, lat]
    zoom: 9, // starting zoom
    projection: 'globe' // display the map as a 3D globe
});

map.on('style.load', () => {
    map.setFog({}); // Set the default atmosphere style
});

const bounds = new mapboxgl.lngatBounds();

locations.forEach(loc => {
// Ceate marker
const el = document.createElement('div');
el.className = 'marker';

// Add marker
new mapboxgl.Marker({
    element: el,
    anchor: 'button'
})
  .setLngLat(loc.coordinates)
  .addTo(map);

  new mapboxgl.Popup({
    offset: 30
  })
    .setLngLat(loc.coordinates)
    .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
    .addTo(map);

  // Extend map bounds to include current location
  bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100
    }
  });
}