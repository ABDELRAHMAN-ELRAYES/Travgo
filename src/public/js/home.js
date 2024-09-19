'strict mode';

let mapty = document.getElementById('map');
let locations = JSON.parse(mapty.dataset.locations);




let firstLocation = locations[0].coordinates;
var map = L.map('map').setView(firstLocation, 3);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

locations.forEach((loc) => {
  L.marker(loc.coordinates)
    .addTo(map)
    .bindPopup(loc.description, {
      autoClose: false,
      closeOnClick: false,
    })
    .openPopup();
});
