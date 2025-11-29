// // //Fetching OpenCritic API

// const url = 'https://opencritic-api.p.rapidapi.com/review/game/463?skip=20&sort=popularity';
// const key = 'c35335b087mshdcc88c2911dcafep107f79jsn94e9e1a61c34';
// const options = {
// 	method: 'GET',
// 	headers: {
// 		'x-rapidapi-key': key,
// 		'x-rapidapi-host': 'opencritic-api.p.rapidapi.com'
// 	}
// };

// (async () => {
//   try {
//     const response = await fetch(url, options);
//     const result = await response.text();  // or response.json()
//     console.log(result);
//   } catch (error) {
//     console.error(error);
//   }
// })();

//Fetching OpenTripMap API

const url = 'http://api.opentripmap.com/0.1/';
const key = '5ae2e3f221c38a28845f05b6fcdc9c8409f901faa8f310d889bb4637';
const lang = 'en';