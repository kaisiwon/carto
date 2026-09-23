// Initialize the map and set its view centered on Ashfield 2131
// Latitude: -33.8886, Longitude: 151.1248, Zoom Level: 15
const map = L.map('map').setView([-33.8886, 151.1248], 15);

// Add OpenStreetMap base map tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Data array holding our Ashfield public facilities
const facilities = [
    {
        name: "Ashfield Library",
        lat: -33.88896,
        lng: 151.12433,
        desc: "Public library offering books, internet access, study spaces, and community programs.",
        accessibility: "Wheelchair accessible, Elevators available.",
        hours: "Mon-Sun: 9:00 AM - 5:00 PM",
        icon: "📚"
    },
    {
        name: "Ashfield Aquatic Centre",
        lat: -33.88425,
        lng: 151.11928,
        desc: "Community pool and fitness center featuring indoor and outdoor swimming options.",
        accessibility: "Ramp access to pools, Accessible change rooms.",
        hours: "Mon-Sun: 6:00 AM - 8:00 PM",
        icon: "🏊"
    },
    {
        name: "Ashfield Park",
        lat: -33.8847,
        lng: 151.1336,
        desc: "Large public park with playgrounds, BBQ areas, and sports fields.",
        accessibility: "Paved pathways, Accessible restrooms.",
        hours: "Open 24/7",
        icon: "🌳"
    },
    {
        name: "Ashfield Station",
        lat: -33.8876,
        lng: 151.1255,
        desc: "Major transport hub connecting Ashfield to the Greater Sydney train and bus network.",
        accessibility: "Wheelchair accessible, Lifts available to platforms.",
        hours: "Open 24/7",
        icon: "🚆"
    },
    {
        name: "Ashfield Mall",
        lat: -33.8896,
        lng: 151.1243,
        desc: "Shopping center with supermarkets, retail stores, and public restrooms.",
        accessibility: "Wheelchair accessible, Elevators and escalators available.",
        hours: "Mon-Sun: 9:00 AM - 5:30 PM (Thu till 9:00 PM)",
        icon: "🛒"
    },
    {
        name: "Pratten Park",
        lat: -33.89291,
        lng: 151.12320,
        desc: "Historic sporting ground and recreational park with grandstands and open spaces.",
        accessibility: "Paved pathways, Seating areas.",
        hours: "Open 24/7",
        icon: "⚽"
    },
    {
        name: "Ashfield Police Station",
        lat: -33.89116,
        lng: 151.13080,
        desc: "Local police station providing community safety and emergency services.",
        accessibility: "Wheelchair accessible front desk.",
        hours: "Open 24/7",
        icon: "👮"
    },
    {
        name: "Peace Park",
        lat: -33.8985,
        lng: 151.1229,
        desc: "A beautiful local park featuring open spaces, walking trails, and family picnic areas.",
        accessibility: "Paved pathways.",
        hours: "Open 24/7",
        icon: "🌳"
    }, 
];

// Array to hold our marker instances for filtering
const facilityMarkers = [];

// Loop through the data and plot markers on the map
facilities.forEach(facility => {
    // Create a custom icon using HTML and CSS
    const customIcon = L.divIcon({
        html: facility.icon,
        className: 'custom-map-icon',
        iconSize: [36, 36], // Width and height of the icon circle
        iconAnchor: [18, 18], // Center point of the icon
        popupAnchor: [0, -18] // Point from which the popup should open
    });
    
    const marker = L.marker([facility.lat, facility.lng], { icon: customIcon }).addTo(map);
    
    // Create the pop-up content with usage instructions and details
    const popupContent = `
        <div style="font-family: Arial, sans-serif;">
            <h3 style="margin: 0 0 5px 0; color: #0056b3;">${facility.name}</h3>
            <p style="margin: 0 0 10px 0; font-size: 14px;">${facility.desc}</p>
            <p style="margin: 0 0 5px 0; font-size: 13px;"><strong>🕒 Hours:</strong> ${facility.hours}</p>
            <p style="margin: 0; font-size: 13px;"><strong>♿ Access:</strong> ${facility.accessibility}</p>
        </div>
    `;
    
    // Attach the pop-up to the map marker
    marker.bindPopup(popupContent);

    // Store the marker and facility data for the search feature
    facilityMarkers.push({ marker: marker, facility: facility });
});

// --- Search Feature ---
const searchBar = document.getElementById('search-bar');

searchBar.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    
    facilityMarkers.forEach(item => {
        // Check if the facility name or description includes the search term
        const matches = item.facility.name.toLowerCase().includes(searchTerm) || 
                        item.facility.desc.toLowerCase().includes(searchTerm);
        
        // Add or remove the marker from the map based on the search match
        if (matches) {
            if (!map.hasLayer(item.marker)) {
                map.addLayer(item.marker);
            }
        } else {
            if (map.hasLayer(item.marker)) {
                map.removeLayer(item.marker);
            }
        }
    });
});

// --- User Location Feature ---
const locateBtn = document.getElementById('locate-btn');
let userMarker = null;

locateBtn.addEventListener('click', () => {
    // Start locating via Leaflet's geolocation method
    map.locate({ setView: true, maxZoom: 15 });
    locateBtn.innerText = "⏳ Locating...";
});

// When location is successfully found
map.on('locationfound', function(e) {
    locateBtn.innerText = "📍 Find My Location";
    
    // Remove existing marker if the user clicks multiple times
    if (userMarker) {
        map.removeLayer(userMarker);
    }

    const userIcon = L.divIcon({
        html: '👤',
        className: 'user-map-icon',
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -18]
    });

    // Add marker at the user's location
    userMarker = L.marker(e.latlng, { icon: userIcon }).addTo(map)
        .bindPopup('<div style="font-family: Arial, sans-serif;"><h3 style="margin: 0 0 5px 0; color: #cc0000;">You are here!</h3></div>')
        .openPopup();
});

// If location access is denied or fails
map.on('locationerror', function(e) {
    locateBtn.innerText = "📍 Find My Location";
    alert("Could not find your location. Please check your browser permissions.");
});