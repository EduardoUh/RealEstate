// || (logical or)  operator evaluates wheter left side is truty or 
// falsy because, in this case values are not boolean are string 
// instead (empty string or some value string), ?? (nulish coaleshing)
// operator evaluates if left side is null of undefined that's why 
// we don't use it here

// this is an IIFE (Immediately invoked function expressions)
(function () {
    // Seleccionar los inputs y párrafos que van a guardar los valores
    const pAddress = document.querySelector('.address');
    const iAddress = document.querySelector('#address');
    const iLat = document.querySelector('#lat');
    const iLng = document.querySelector('#lng');
    // 20.2027946, -89.2875277 coordenadas de tekax, no las uso porque leaflet no tiene imagenes de tekax
    const lat = iLat.value || 34.040967; // 20.67444163271174;
    const lng = iLng.value || -118.1618621; // -103.38739216304566;
    // toma como valor el div con el id map que está en create.pug
    const map = L.map('map').setView([lat, lng], 16);
    let marker;

    // utilizar provider y geocoder
    const geocodeService = L.esri.Geocoding.geocodeService();

    // el bjeto L contiene toda la información de leaftlet
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // añadir pin
    marker = new L.marker([lat, lng], {
        // que el pin pueda moverse
        draggable: true,
        // que el mapa se centre al mover el pin
        autoPan: true
    })
        .addTo(map)

    // detectar el movimiento del pin y leer latitud y longitud

    marker.on('moveend', (e) => {
        // marker tomara el valor de a donde se esté colocand el pin
        marker = e.target;
        // console.log(marker);
        // obtenemos las coordenadas del pin
        const position = marker.getLatLng();
        // console.log(position);
        // hacer que el mapa se centre de acuerdo a la posición del pin
        map.panTo(new L.LatLng(position.lat, position.lng));
        // obtener coordenadas y nombre de la calle al soltar el pin
        geocodeService.reverse().latlng(position, 15).run((error, result) => {
            console.log(result);
            console.log(result?.latlng?.lat);
            console.log(result?.latlng?.lng);
            // console.log(error);
            // añadir un popup al hacer click en el ping
            marker.bindPopup(result.address.LongLabel);

            /* document.querySelector('.address').textContent = result?.address?.Address ?? '';
            document.querySelector('#address').value = result?.address?.Address ?? '';
            document.querySelector('#lat').value = result?.latlng?.lat ?? '';
            document.querySelector('#lng').value = result?.latlng?.lng ?? ''; */
            pAddress.textContent = result?.address?.Address ?? '';
            iAddress.value = result?.address?.Address ?? '';
            iLat.value = result?.latlng?.lat ?? '';
            iLng.value = result?.latlng?.lng ?? '';
        });
    });

})()