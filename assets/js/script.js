//Fetching OpenCritic API

const baseUrl = 'https://opencritic-api.p.rapidapi.com';
const key = '25f2691066mshfaa4aef9a804676p1a889ajsnc114508e2a85';
const options = {
	method: 'GET',
	headers: {
		'x-rapidapi-key': key,
		'x-rapidapi-host': 'opencritic-api.p.rapidapi.com'
	}
};

// Youtube trailer API info
const YT_API_KEY = 'AIzaSyDX-NW1UKhu6aHyYWkMa8jO3KUX19MQBLs';
const YT_BASE_URL = 'https://www.googleapis.com/youtube/v3/search';

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

//Search YT trailer
async function fetchYouTubeTrailer(gameTitle) {

  const YT_query = `${gameTitle} official trailer`;

  const params = new URLSearchParams({
    key: YT_API_KEY,
    part: "snippet",
    q: YT_query,
    type: "video",
    maxResults: "1",
    videoEmbeddable: "true",
  });

  const YT_url = `${YT_BASE_URL}?${params.toString()}`;
  console.log("YouTube search URL:", YT_url);
  const response = await fetch(YT_url);
  if (!response.ok) {
    throw new Error(`YouTube HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  console.log("YouTube search response:", data);

  const items = data.items || [];
  if (items.length === 0) {
    return null;
  }

  return items[0].id.videoId || null;
}

//YT trailer embedding 
async function loadTrailer(gameTitle, containerEl) {
   console.log("Searching YouTube trailer for:", gameTitle);
  if (!containerEl) return;


  containerEl.textContent = "Loading trailer...";

  try {
    const videoId = await fetchYouTubeTrailer(gameTitle);

    if (!videoId) {
      containerEl.textContent = "No trailer found on YouTube.";
      return;
    }

    // Clear text and embed iframe
    containerEl.textContent = "";

    const iframeWrapper = document.createElement("div");
    iframeWrapper.className = "video-container";

    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube.com/embed/${videoId}`;
    iframe.title = `${gameTitle} trailer`;
    iframe.allow =
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    iframeWrapper.appendChild(iframe);
    containerEl.appendChild(iframeWrapper);

  // 🔗 Fallback: direct link in case embed has issues 
    const link = document.createElement("a");
    link.href = `https://www.youtube.com/watch?v=${videoId}`;
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = "Watch this trailer on YouTube";

    const linkWrapper = document.createElement("p");
    linkWrapper.className = "mt-2";
    linkWrapper.appendChild(link);

    containerEl.appendChild(linkWrapper);
  } catch (err) {
    console.error("Error loading YouTube trailer:", err);
    containerEl.textContent = "Error loading trailer.";
  }
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


  // 2 columns

  // Bulma columns: one for text, one for the image
  const columns = document.createElement('div');
  columns.className = "columns is-vcentered";

  // LEFT (Text )
  const leftCol = document.createElement('div');
  leftCol.className = "column";

  // RIGHT (Game image)
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

  // BACK button
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


  // game title
  const titleEl = document.createElement('p');
  titleEl.className = "title is-4";
  titleEl.textContent = game.name || "Untitled game";

  
  // release date
  const rawDate = game.firstReleaseDate || game.releaseDate || null;
  let releaseDate = null;
  if (rawDate && typeof rawDate === "string") {
    releaseDate = rawDate.split("T")[0];
  }

  const releaseDateEl = document.createElement("p");
  releaseDateEl.className = "is-size-6";
  releaseDateEl.innerHTML = `<strong>📅 Release date:</strong> ${
    releaseDate || "N/A"
  }`;

  // creators (Developers / Publishers)
  const creatorsEl = document.createElement("p");
  creatorsEl.className = "is-size-6";

  const companies = Array.isArray(game.companies)
    ? game.companies
    : Array.isArray(game.Companies)
    ? game.Companies
    : [];

  if (companies.length > 0) {
    const names = companies.map((c) => c.name || c).join(", ");
    creatorsEl.innerHTML = `<strong>👥 Creators:</strong> ${names}`;
  } else {
    creatorsEl.innerHTML = `<strong>👥 Creators:</strong> N/A`;
  }

  // Platforms
  const platformsEl = document.createElement("p");
  platformsEl.className = "is-size-6";

  const platforms = Array.isArray(game.platforms)
    ? game.platforms
    : Array.isArray(game.Platforms)
    ? game.Platforms
    : [];

  if (platforms.length > 0) {
    const platformNames = platforms.map((p) => p.name || p).join(", ");
    platformsEl.innerHTML = `<strong>🎮 Platforms:</strong> ${platformNames}`;
  } else {
    platformsEl.innerHTML = `<strong>🎮 Platforms:</strong> N/A`;
  }

  // OC score

  const ratingWrapper = document.createElement("p");
  ratingWrapper.className = "is-size-6 mt-2";


  // Supports both possible field names from API
  const score = game.topCriticScore ?? game.openCriticScore;

  const scoreLabel = document.createElement("span");
scoreLabel.textContent = "⭐ OpenCritic Score: ";

// Badge
const scoreBadge = document.createElement("span");
scoreBadge.className = "tag is-medium";

// Format number to 2 decimals if possible
let formattedScore = null;
if (typeof score === "number" && !Number.isNaN(score)) {
  formattedScore = score.toFixed(2); // e.g. 87.34
} else if (score != null) {
  const num = Number(score);
  formattedScore = Number.isNaN(num) ? String(score) : num.toFixed(2);
}

if (formattedScore !== null) {
  scoreBadge.textContent = `${formattedScore}/100`;
} else {
  scoreBadge.textContent = "N/A";
}

// Color-code based on score
if (formattedScore !== null) {
  const numeric = Number(formattedScore);
  if (numeric >= 85) {
    scoreBadge.classList.add("is-success"); // great
  } else if (numeric >= 70) {
    scoreBadge.classList.add("is-info"); // good
  } else if (numeric >= 50) {
    scoreBadge.classList.add("is-warning"); // meh
  } else {
    scoreBadge.classList.add("is-danger"); // low
  }
} else {
  scoreBadge.classList.add("is-dark");
}
  ratingWrapper.appendChild(scoreLabel);
  ratingWrapper.appendChild(scoreBadge);

  // Description
  const descriptionEl = document.createElement('div');
  descriptionEl.className = "content mt-3";
  descriptionEl.textContent =
    game.description || "No description available.";

  //YT trailer container
  const trailerContainer = document.createElement('div');
  trailerContainer.className = 'mt-4';
  trailerContainer.textContent = 'Loading trailer...';
  
  if (game.name) {
  loadTrailer(game.name, trailerContainer);
} else {
  trailerContainer.textContent =
    "No game title available to search for a trailer.";
}
  
  // Text- left column
  leftCol.appendChild(backBtn);
  leftCol.appendChild(titleEl);
  leftCol.appendChild(releaseDateEl);
  leftCol.appendChild(creatorsEl);
  leftCol.appendChild(platformsEl);
  leftCol.appendChild(ratingWrapper);
  leftCol.appendChild(descriptionEl);
  leftCol.appendChild(trailerContainer);


  // Right column
  rightCol.appendChild(imgWrapper);

 // combine columns
  columns.appendChild(leftCol);
  columns.appendChild(rightCol);

  // Add columns to the card
  cardContent.appendChild(columns);
  card.appendChild(cardContent);
  column.appendChild(card);

  //add to results container 
  resultsContainer.appendChild(column);
} 
} 

