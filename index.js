const apiUrl = 'https://cors-anywhere.herokuapp.com/https://openwhyd.org/hot/electro?format=json';

let tracks = [];

// Fetch data from API
async function fetchTracks() {
    try {
        const response = await fetch(apiUrl);
        if (response.status === 429) {
            throw new Error('Too many requests. Please try again later.');
        }
        const data = await response.json();

        // Ensure the data has a 'tracks' property that is an array
        if (Array.isArray(data.tracks)) {
            tracks = data.tracks;
        } else {
            console.error('Received data is not valid or tracks property is missing:', data);
        }

        displayTracks();
    } catch (error) {
        console.error('Error fetching tracks:', error);
    }
}

// Function to display tracks
function displayTracks(filter = '') {
    const trackList = document.getElementById('track-list');
    trackList.innerHTML = ''; // Clear the previous content

    // Check if tracks is an array before attempting to filter
    if (Array.isArray(tracks)) {
        const filteredTracks = tracks.filter(track =>
            track.name?.toLowerCase().includes(filter) ||
            (track.pl && track.pl.name?.toLowerCase().includes(filter))
        );

        filteredTracks.forEach(track => {
            const trackCard = document.createElement('div');
            trackCard.classList.add('track-card');

            trackCard.innerHTML = `
                <img src="${track.img || 'https://via.placeholder.com/250'}" alt="${track.name || 'No title'}">
                <h3>${track.name || 'No title available'}</h3>
                <p>Playlist: ${track.pl ? track.pl.name : 'N/A'}</p>
                <a href="${track.trackUrl.startsWith('http') ? track.trackUrl : 'https:' + track.trackUrl}" 
                   target="_blank">Watch on YouTube</a>
            `;
            trackList.appendChild(trackCard);
        });
    } else {
        console.error('tracks is not an array:', tracks);
    }
}

// Search function
function searchTracks() {
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    displayTracks(searchInput);
}

// Load tracks on page load
window.onload = fetchTracks;
