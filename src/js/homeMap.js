(function () {
    const lat = 34.040967;
    const lng = -118.1618621;
    // toma como valor el div con el id map que está en create.pug
    const map = L.map('home-map').setView([lat, lng], 13);
    let markers = new L.FeatureGroup().addTo(map);
    let properties = [];
    // filters
    const filters = {
        category: '',
        price: ''
    };
    const categoriesSelect = document.querySelector('#categories');
    const pricesSelect = document.querySelector('#prices');

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    categoriesSelect.addEventListener('change', e => {
        filters.category = +e.target.value;
        filterProperties();
    })

    pricesSelect.addEventListener('change', e => {
        filters.price = +e.target.value;
        filterProperties();
    })

    const getProperties = async () => {
        try {
            const url = '/api/properties';
            const response = await fetch(url);
            properties = await response.json();
            showProperties(properties)
        }
        catch (err) {
            console.log(err);
        }
    }
    const showProperties = properties => {
        // Delete previous pins
        markers.clearLayers();
        // adding ping on each property location
        properties.forEach(property => {
            const marker = new L.marker([property?.lat, property?.lng], {
                autoPan: true
            })
                .addTo(map)
                .bindPopup(`
                    <p class="text-indigo-600 text-md font-bold">${property.category.name}</p>
                    <h1 class="text-xl font-extrabold uppercase my-3">${property.title}</h1>
                    <img src="/uploads/${property.picture}" alt="Property picture - ${property.title}">
                    <p class="text-gray-500 text-sm text-center font-bold">${property.price.name}</p>
                    <a href="/property/${property.id}" class="text-center block bg-indigo-600 font-bold py-2">See more</a>
                `)
            // Thanks to this layer it is possible apply some filters to the map
            markers.addLayer(marker);
        })
    }

    const filterProperties = () => {
        const result = properties.filter(property => filters.category ? property.categoryId === filters.category : property).filter(property => filters.price ? property.priceId === filters.price : property);
        // console.log(result);
        showProperties(result);
    };

    getProperties();
})()