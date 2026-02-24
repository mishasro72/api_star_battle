// **
// *Choose characters
// **************************************

const charactersUrl = "https://www.swapi.tech/api/people?page=1&limit=35";
const heroUrl = "https://www.swapi.tech/api/people/";
const planetsUrl = "https://www.swapi.tech/api/planets/";
const starshipsUrl = "https://www.swapi.tech/api/starships/";
const listOfPlanets = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const listOfStarships = [2, 3, 5, 9, 10, 11, 13];

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

async function startBattlePhaseOne() {
  let charactersList = await getCharecters(charactersUrl);
  if (!charactersList) return;

  function getRandom(arr) {
    return [...arr].sort(() => 0.5 - Math.random());
  }

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

  async function getHeroInfo(hero) {
    try {
      const response = await fetch(`${heroUrl}${hero.id}`);
      if (!response.ok) {
        throw new Error(response.status);
      }
      const data = await response.json();
      const details = data.result.properties;

      const updateHero = {
        ...hero,
        height: details.height,
        mass: details.mass,
        planet: details.homeworld.split("/").filter(Boolean).pop(),
        starships: details.starships.map((starship) =>
          starship.split("/").filter(Boolean).pop(),
        ),
        power: details.mass * details.height,
      };
      return updateHero;
    } catch (error) {
      console.error(error);
    }
  }

  let teamOnePlayers = getRandom(charactersList).slice(0, 3);
  let teamTwoPlayers = getRandom(charactersList).slice(3, 6);

  async function fillTeamsInfo() {
    teamOnePlayers = await Promise.all(
      teamOnePlayers.map(async (player, index) => {
        getCard(player, index);
        return await getHeroInfo(player);
      }),
    );

    teamTwoPlayers = await Promise.all(
      teamTwoPlayers.map(async (player, index) => {
        getCard(player, index + 3);
        return await getHeroInfo(player);
      }),
    );

    window.alert(
      `Your team is ready: ${teamOnePlayers.map((p) => p.name).join(", ")}`,
    );
    window.alert(
      `Enemy team is ready: ${teamTwoPlayers.map((p) => p.name).join(", ")}`,
    );
  }
  fillTeamsInfo();

  async function getPlanet() {
    const planet = getRandom(listOfPlanets).slice(0, 1);

    let bodyBackground = document.querySelector("body.battle-page");
    bodyBackground.style.backgroundImage = `url("./images/backGround/${planet}.png")`;

    let choosePlanetFlex = document.querySelector(".planet-card");
    let planetCard = document.createElement("img");
    planetCard.src = `./images/planet/${planet}.png`;
    planetCard.alt = "Planet card image";
    planetCard.classList.add("card-img");
    choosePlanetFlex.append(planetCard);

    console.log(`Battle planet is: ${planet}`);

    try {
      const response = await fetch(`${planetsUrl}${planet}`);
      if (!response.ok) {
        throw new Error(response.status);
      }
      const data = await response.json();
      const details = data.result.properties;

      const updatePlanet = {
        id: planet,
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
  getPlanet();
}

const chooseTeamButton = document.querySelector("button.choose-team");
chooseTeamButton.addEventListener("click", startBattlePhaseOne);

//
