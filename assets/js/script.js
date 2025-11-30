// //Fetching OpenCritic API

const url = 'https://opencritic-api.p.rapidapi.com/';
const key = 'c35335b087mshdcc88c2911dcafep107f79jsn94e9e1a61c34';
const options = {
	method: 'GET',
	headers: {
		'x-rapidapi-key': key,
		'x-rapidapi-host': 'opencritic-api.p.rapidapi.com'
	}
};

(async () => {
  try {
    const response = await fetch(url, options);
    const result = await response.text();  // or response.json()
    console.log(result);
  } catch (error) {
    console.error(error);
  }
})();

//Dom Elements 
const searchForm = document.getElementById('search-form');
const gameInput = document.getElementById('game-input');
const statusMessage = document.getElementById('status-message');
const resultsContainer = document.getElementById('results-container');
const resultsEmpty = document.getElementById('results-empty');
const resultsCount = document.getElementById('results-count');

