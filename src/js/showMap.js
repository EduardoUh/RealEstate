// || (logical or)  operator evaluates wheter left side is truty or 
// falsy because, in this case values are not boolean are string 
// instead (empty string or some value string), ?? (nulish coaleshing)
// operator evaluates if left side is null of undefined that's why 
// we don't use it here

// this is an IIFE (Immediately invoked function expressions)
(function () {
    const pLat = document.querySelector('#lat').textContent;
    const pLng = document.querySelector('#lng').textContent;
    const address = document.querySelector('#address').textContent;
    const title = document.querySelector('#title').textContent;
    const map = L.map('map').setView([pLat, pLng], 16);

    // el bjeto L contiene toda la información de leaftlet
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // add pin
    L.marker([pLat, pLng])
        .addTo(map)
        .bindPopup(`${title}, ${address}`)

})()