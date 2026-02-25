const charactersUrl = "https://www.swapi.tech/api/people?page=1&limit=35";
const heroUrl = "https://www.swapi.tech/api/people/";
const planetsUrl = "https://www.swapi.tech/api/planets/";
const starshipsUrl = "https://www.swapi.tech/api/starships/";
const listOfPlanets = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const listOfStarships = [2, 3, 5, 9, 10, 11, 13];
const listOfTeam = ["One", "Two"];

let gameState = {
  isGameStarted: false,
  teamOne: [],
  teamTwo: [],
  teamOnePower: 0,
  teamTwoPower: 0,
  teamOneStarship: "",
  teamOneStarshipPilots: [],
  teamTwoStarship: "",
  teamTwoStarshipPilots: [],
  planet: "",
};

function getRandom(arr) {
  return [...arr].sort(() => 0.5 - Math.random());
}

// **
// *Choose characters
// **************************************

async function getCharacters(url) {
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

async function startBattlePhaseOne() {
  let charactersList = await getCharacters(charactersUrl);
  if (!charactersList) return;

  function getCard(hero, n) {
    const cardImage = document.createElement("img");
    cardImage.src = `./images/hero/${hero.id}.png`;
    cardImage.setAttribute("alt", `${hero.name} image`);
    cardImage.classList.add("card-img");

    const imageHolder = document.querySelector(`div.player-${n + 1}`);
    if (imageHolder) {
      imageHolder.append(cardImage);
    }
  }

  async function getHeroInfo(hero, team) {
    try {
      const response = await fetch(`${heroUrl}${hero.id}`);
      if (!response.ok) {
        throw new Error(response.status);
      }
      const data = await response.json();
      const details = data.result.properties;

      const updateHero = {
        ...hero,
        height: details.height === "unknown" ? 70 : parseInt(details.height),
        mass: details.mass === "unknown" ? 70 : parseInt(details.mass),
        planet: details.homeworld.split("/").filter(Boolean).pop(),
        starships: details.starships.map((starship) =>
          starship.split("/").filter(Boolean).pop(),
        ),
      };
      gameState[`team${team}Power`] += updateHero.height * updateHero.mass;
      return updateHero;
    } catch (error) {
      console.error(error);
    }
  }

  let shufflePlayers = getRandom(charactersList);

  gameState.teamOne = shufflePlayers.slice(0, 3);
  gameState.teamTwo = shufflePlayers.slice(3, 6);

  async function fillTeamsInfo() {
    teamOnePlayers = await Promise.all(
      gameState.teamOne.map(async (player, index) => {
        getCard(player, index);
        return await getHeroInfo(player, "One");
      }),
    );

    teamTwoPlayers = await Promise.all(
      gameState.teamTwo.map(async (player, index) => {
        getCard(player, index + 3);
        return await getHeroInfo(player, "Two");
      }),
    );
    window.alert(
      `Your team is ready: ${teamOnePlayers.map((p) => p.name).join(", ")}`,
    );
    window.alert(
      `Enemy team is ready: ${teamTwoPlayers.map((p) => p.name).join(", ")}`,
    );
    return gameState;
  }
  await fillTeamsInfo();

// **
// *Choose planet
// **************************************

  async function getPlanet() {
    gameState.planet = getRandom(listOfPlanets).slice(0, 1);

    let bodyBackground = document.querySelector("body.battle-page");
    bodyBackground.style.backgroundImage = `url("./images/backGround/${gameState.planet}.png")`;

    let choosePlanetFlex = document.querySelector(".planet-card");
    let planetCard = document.createElement("img");
    planetCard.src = `./images/planet/${gameState.planet}.png`;
    planetCard.alt = "Planet card image";
    planetCard.classList.add("card-img");
    choosePlanetFlex.append(planetCard);

    console.log(`Battle planet is: ${gameState.planet}`);

    try {
      const response = await fetch(`${planetsUrl}${gameState.planet}`);
      if (!response.ok) {
        throw new Error(response.status);
      }
      const data = await response.json();
      const details = data.result.properties;

      const updatePlanet = {
        id: gameState.planet,
        name: details.name,
        description: details.description,
      };
      window.alert(
        `The battle will take place on the planet: ${updatePlanet.name}`,
      );
    } catch (error) {
      console.error(error);
    }
  }
  await getPlanet();
  return gameState;
}

// **
// *Choose starship
// **************************************

async function startBattlePhaseTwo() {
  let shuffleStarships = getRandom(listOfStarships);

  gameState.teamOneStarship = shuffleStarships[0];
  gameState.teamTwoStarship = shuffleStarships[1];

  async function getStarship(team) {
    const starship = gameState[`team${team}Starship`];
    console.log(starship);

    let starshipBox = document.querySelector(`.starship${team}`);
    let starshipCard = document.createElement("img");
    starshipCard.src = `./images/starship/${starship}.png`;
    starshipCard.alt = "Starship card image";
    starshipCard.classList.add("card-img");
    starshipBox.append(starshipCard);

    try {
      const response = await fetch(`${starshipsUrl}${starship}`);
      if (!response.ok) {
        throw new Error(response.status);
      }
      const data = await response.json();
      const details = data.result.properties;
      gameState[`team${team}StarshipPilots`] = details.pilots.map((pilot) =>
        pilot.split("/").filter(Boolean).pop(),
      );
      window.alert(
        `The team ${team} will fight with the starship: ${details.name}`,
      );
    } catch (error) {
      console.error(error);
    }
  }
  for (let team of listOfTeam) {
    await getStarship(team);
  }
  console.log(gameState.teamOneStarshipPilots, gameState.teamTwoStarshipPilots);
  console.log(gameState);
}

// **
// *Count score
// **************************************

async function startBattlePhaseScore() {
  const teamOneElement = document.querySelector(".team1-block");
  const teamTwoElement = document.querySelector(".team2-block");

  teamOneElement.classList.remove("winner");
  teamTwoElement.classList.remove("winner");

  for (let team of listOfTeam) {
    if (
      gameState[`team${team}`].some((hero) =>
        gameState[`team${team}StarshipPilots`].includes(hero.id),
      )
    ) {
      gameState[`team${team}Power`] += 1000;
      window.alert(`Expert pilot bonus for team ${team}! +1000 power.`);
      console.log(`Expert pilot bonus for team ${team}! +1000 power.`);
    }
  }

  let scoreTeamOne = document.querySelector(".score-team-one");
  let scoreTeamTwo = document.querySelector(".score-team-two");

  scoreTeamOne.textContent = `Team One Score: ${gameState.teamOnePower}`;
  scoreTeamTwo.textContent = `Team Two Score: ${gameState.teamTwoPower}`;

  const teamOneScore = gameState.teamOnePower;
  const teamTwoScore = gameState.teamTwoPower;

  if (teamOneScore > teamTwoScore) {
    teamOneElement.classList.add("winner");
    window.alert("Team One Wins!");
  } else if (teamOneScore < teamTwoScore) {
    teamTwoElement.classList.add("winner");
    window.alert("Team Two Wins!");
  } else {
    window.alert("It's a tie!");
  }
}


// **
// *Game flow
// **************************************

const chooseTeamButton = document.querySelector("button.choose-team");
const chooseStarshipButton = document.querySelector("button.choose-starship");

chooseTeamButton.addEventListener("click", async (event) => {
  if (gameState.isGameStarted) {
    location.reload();
  } else {
    gameState.isGameStarted = true;
    const relodGameText = document.querySelector(".choose-team-button-text");
    relodGameText.textContent = "Press to reload game";

    chooseStarshipButton.disabled = false;
    await startBattlePhaseOne();
  }
});

chooseStarshipButton.addEventListener("click", async (event) => {
  if (!gameState.isGameStarted) {
    alert("You should choose your first!");
    return;
  }
  chooseStarshipButton.disabled = true;
  await startBattlePhaseTwo();
  await startBattlePhaseScore();
});
