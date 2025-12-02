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

//storage for search results
let lastSearchResults = null;

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

//Show results in clickable cards?

function renderSearchResults(games) {
    clearResults();

    //saves results for back button
      lastSearchResults = games;


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
      selectBtn.className = "button is-small is-primary is-rounded mt-2";
      selectBtn.textContent = "View Details";

      //User clicks View Details
      selectBtn.addEventListener('click', () => {
        console.log(`user selected "${game.name}"`);
        fetchGameDetails(game.id);
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

  // Selected Game Details
  async function fetchGameDetails(gameId) {
    const GameUrl = `${baseUrl}/game/${gameId}`;
    console.log("Fetching details for game ID:", gameId);

    const response = await fetch(GameUrl, options);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const gameDetails = await response.json();
    renderGameDetails(gameDetails);
    console.log("Game Details:", gameDetails);

    return gameDetails;
}

//render game details

function renderGameDetails(game) {
  // Clear search results
  clearResults(); 

  // Create a full-width Bulma column to hold the card
  const column = document.createElement('div');
  column.className = "column is-12";

  // Outer card
  const card = document.createElement('div');
  card.className = "card";

  // Inner padding & content container
  const cardContent = document.createElement('div');
  cardContent.className = "card-content";


  // TWO-COLUMN LAYOUT

  // Bulma columns: one for text, one for the image
  const columns = document.createElement('div');
  columns.className = "columns is-vcentered";

  // LEFT COLUMN (Text info)
  const leftCol = document.createElement('div');
  leftCol.className = "column";

  // RIGHT COLUMN (Game cover image)
  const rightCol = document.createElement('div');
  rightCol.className = "column is-one-third has-text-centered";

  const imageBaseUrl = 'https://img.opencritic.com/';

  const firstScreenshot =
    game.images?.screenshots?.[0] || null;

let screenshotUrl = null;
if (firstScreenshot) {
  const path = firstScreenshot.sm || firstScreenshot.og;
  screenshotUrl = imageBaseUrl + path;
}

if (screenshotUrl) {
  const imgWrapper = document.createElement('figure');
  imgWrapper.className = "image";

  const img = document.createElement('img');
  img.src = screenshotUrl;
  img.alt = game.name || 'Screenshot';
  img.className = 'game-screenshot';

  // IMG styling
  img.style.borderRadius = "8px";
  img.style.maxWidth = "260px";
  img.style.margin = "0 auto";

  imgWrapper.appendChild(img);

  // BACK BUTTON
  const backBtn = document.createElement('button');
  backBtn.className = "button is-light is-primary is-small mb-3";
  backBtn.textContent = "← Back to results";

  backBtn.addEventListener('click', () => {
  if (lastSearchResults && Array.isArray(lastSearchResults)) {
    renderSearchResults(lastSearchResults);
    setStatus("Select a game to view details.");
  } else {
    setStatus("There are no previous search results to return to.");
  }
  });


  // GAME TITLE
  const titleEl = document.createElement('p');
  titleEl.className = "title is-4";
  titleEl.textContent = game.name || "Untitled game";

  // RELEASE DATE
  const releaseDate = (game.firstReleaseDate || game.releaseDate).split('T')[0]|| null;

  const releaseDateEl = document.createElement('p');
  releaseDateEl.className = "is-size-6";
  releaseDateEl.textContent = releaseDate
    ? `Release date: ${releaseDate}`
    : "Release date: N/A";

  // CREATORS (Developers / Publishers)
  const creatorsEl = document.createElement('p');
  creatorsEl.className = "is-size-6";

  // (companies vs Companies)
  const companies = Array.isArray(game.companies)
    ? game.companies
    : Array.isArray(game.Companies)
    ? game.Companies
    : [];

  if (companies.length > 0) {
    creatorsEl.textContent =
      "Creators: " + companies.map(c => c.name || c).join(", ");
  } else {
    creatorsEl.textContent = "Creators: N/A";
  }

  // PLATFORMS
  const platformsEl = document.createElement('p');
  platformsEl.className = "is-size-6";

  const platforms = Array.isArray(game.platforms)
    ? game.platforms
    : Array.isArray(game.Platforms)
    ? game.Platforms
    : [];

  if (platforms.length > 0) {
    const platformNames = platforms.map(p => p.name || p).join(", ");
    platformsEl.textContent = `Platforms: ${platformNames}`;
  } else {
    platformsEl.textContent = "Platforms: N/A";
  }

  // OPENCRITIC SCORE

  const ratingEl = document.createElement('p');
  ratingEl.className = "is-size-6 mt-2";

  // Supports both possible field names from API
  const score = game.topCriticScore ?? game.openCriticScore;

  ratingEl.textContent = 
    score != null
      ? `OpenCritic Score: ${score}/100`
      : "OpenCritic Score: N/A";

  // DESCRIPTION
  const descriptionEl = document.createElement('div');
  descriptionEl.className = "content mt-3";
  descriptionEl.textContent =
    game.description || "No description available.";

  
  // APPEND ALL TEXT LEFT COLUMN
  leftCol.appendChild(backBtn);
  leftCol.appendChild(titleEl);
  leftCol.appendChild(releaseDateEl);
  leftCol.appendChild(creatorsEl);
  leftCol.appendChild(platformsEl);
  leftCol.appendChild(ratingEl);
  leftCol.appendChild(descriptionEl);

  // RIGHT COLUMN
  rightCol.appendChild(imgWrapper);

 // ASSEMBLE THE TWO COLUMNS
  columns.appendChild(leftCol);
  columns.appendChild(rightCol);

  // Add columns to the card
  cardContent.appendChild(columns);
  card.appendChild(cardContent);
  column.appendChild(card);

  //add to results container replacing previous cards
  resultsContainer.appendChild(column);
} 
} 

