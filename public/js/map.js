mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 9 // starting zoom
});
// console.log(listing.geometry.coordinates);


const marker = new mapboxgl.Marker({ color: 'red' })
    .setLngLat(listing.geometry.coordinates)
    .setPopup(new mapboxgl.Popup().setHTML(`<h5>${listing.location}</h5><p>Exact location will provided after booking!</p>`))
    .addTo(map);

map.on('load', () => {
    map.addSource('places', {
        'type': 'geojson',
        'generateId': true,
        'data': {
            'type': 'FeatureCollection',
            'features': [
                {
                    'type': 'Feature',
                    'properties': {
                        'description':
                            '<div class="mapHover"><i class="fa-solid fa-house"></i></div>'
                    },
                    'geometry': {
                        'type': 'Point',
                        'coordinates': listing.geometry.coordinates
                    }
                },
            ]
        }
    });
    // Add a layer showing the places.
    map.addLayer({
        'id': 'places',
        'type': 'circle',
        'source': 'places',
        'paint': {
            'circle-color': '#f96c6c',
            'circle-radius': 10,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff'
        }
    });

    // Create the popup UI, but don't add it to the map yet.
    // You only want the UI to appear once the cursor is hovering over an element.
    const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
    });

    map.addInteraction('places-mouseenter-interaction', {
        type: 'mouseenter',
        target: { layerId: 'places' },
        handler: (e) => {
            map.getCanvas().style.cursor = 'pointer';

            // Copy the coordinates from the POI underneath the cursor
            const coordinates = e.feature.geometry.coordinates.slice();
            const description = e.feature.properties.description;

            // Populate the popup and set its coordinates based on the feature found.
            popup.setLngLat(coordinates).setHTML(description).addTo(map);
        }
    });

    map.addInteraction('places-mouseleave-interaction', {
        type: 'mouseleave',
        target: { layerId: 'places' },
        handler: () => {
            map.getCanvas().style.cursor = '';
            popup.remove();
        }
    });
});