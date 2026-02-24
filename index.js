// **
// *Choose characters
// **************************************

const charactersUrl = "https://www.swapi.tech/api/people?page=1&limit=35";
const planetsUrl = "https://www.swapi.tech/api/planets?page=1&limit=10";
const starshipsUrl = "https://www.swapi.tech/api/starships?page=1&limit=7";

async function getCharecters(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(response.status);
    }
    const data = await response.json();
    return data.results.map((item) => {
      return {
        id: item.uid,
        name: item.name,
        url: item.url,
      };
    });
  } catch (error) {
    console.error(error);
  }
}

async function startBattle() {
  let charactersList = await getCharecters(charactersUrl);

  function getRandomPlayers(arr, n) {
    const shuffledPlayers = [...arr].sort(() => 0.5 - Math.random());
    return shuffledPlayers.slice(0, n);
  }

  let teamOnePlayers = getRandomPlayers(charactersList, 3);
  let teamTwoPlayers = getRandomPlayers(charactersList, 3);

  console.log(teamOnePlayers);
  console.log(teamTwoPlayers);

//   function fillTeamOneCards(teamList){
//     teamList.forEach {

//     }

  }





startBattle();
