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
const gamesDetailsEl = document.getElementById('games-details');

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

    //API URL with query
 const url = `${baseUrl}/game/search?criteria=${encodeURIComponent(query)}`;


    try {
        const response = await fetch(url, options);
        console.log('status', response.status);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log(result);

        renderSearchResults(result);

    } catch (error) {
        console.error(error);
        statusMessage.textContent = 'Error fetching game data.';
    }
    
}); 

//Show results in clickable ards?

function renderSearchResults(games) {
    clearResults();

    if (!Array.isArray(games) || games.length === 0) {
      resultsCount.textContent = "0 results";
      resultsEmpty.textContent = "No results found 😞. Please try another game title.";
      resultsEmpty.style.display = "none";
      setStatus('No Results');
      return;
    }
    resultsEmpty.style.display = "block";
    resultsCount.textContent = `${games.length} result ${games.length === 1 ? 'found' : 'founds'}.`;
    setStatus('Select a game to view details.');


    games.forEach(game => {
      const column = document.createElement('div');
      column.className = "column is-12";

      const card = document.createElement('div');
      card.className = "card";

      const cardContent = document.createElement('div');
      cardContent.className = "card-content";

      const level = document.createElement('div');
      level.className = "level";

      const levelLeft = document.createElement('div');
      levelLeft.className = "level-left";

      const levelRight = document.createElement('div');
      levelRight.className = "level-right";

      //Game Title
      const titleEl = document.createElement('p');
      titleEl.className = "title is-5";
      titleEl.textContent = game.name || "Untitled game";

      // Details Button
      const selectBtn = document.createElement('button');
      selectBtn.className = "button is-small is-info is-rounded mt-2";
      selectBtn.textContent = "View Details";

      //User clicks View Details
      selectBtn.addEventListener('click', () => {
        alert(`You selected "${game.name}"`);
      });

        
//Bulma Game Cards
  levelLeft.appendChild(titleEl);
  levelRight.appendChild(selectBtn);

  level.appendChild(levelLeft);
  level.appendChild(levelRight);

  cardContent.appendChild(level);
  card.appendChild(cardContent);
  column.appendChild(card);

  resultsContainer.appendChild(column);
  });
  }

