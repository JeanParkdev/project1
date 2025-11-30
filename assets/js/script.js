// //Fetching OpenCritic API

const baseUrl = 'https://opencritic-api.p.rapidapi.com';
const key = 'c35335b087mshdcc88c2911dcafep107f79jsn94e9e1a61c34';
const options = {
	method: 'GET',
	headers: {
		'x-rapidapi-key': key,
		'x-rapidapi-host': 'opencritic-api.p.rapidapi.com'
	}
};


//Dom Elements 
const searchForm = document.getElementById('search-form');
const gameInput = document.getElementById('game-input');
const statusMessage = document.getElementById('status-message');
const resultsEmpty = document.getElementById('results-empty');
const resultsCount = document.getElementById('results-count');
const resultsContainer = document.getElementById('results');

function setStatus(message) {
    statusMessage.textContent = message;
}

function clearResults() {
    resultsContainer.innerHTML = '';
}

//Form Submit Event Listener
searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const query = gameInput.value.trim();
    if (!query) {
        statusMessage.textContent = 'Please enter a game title. 🎮';
        return;
    }

    statusMessage.textContent = `Searching for "${query}"...`;
    const url = `${baseUrl}/game/search?criteria=${encodeURIComponent(query)}`;


    try {
        const response = await fetch(url, options);
        console.log('status', response.status);

        const result = await response.json();
        console.log(result);
    } catch (error) {
        console.error(error);
        statusMessage.textContent = 'Error fetching game data.';
    }
}); 