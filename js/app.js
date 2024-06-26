const MAX_POKEMON = 151;
const listWrapper = document.querySelector(".list-wrapper");
const searchInput = document.querySelector(".search-input");
const numberFilter = document.querySelector("#number");
const nameFilter = document.querySelector("#name");
const notFoundMessage = document.querySelector("#not-found-message");
let allPokemon = [];

const getPokemon = async () => {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMON}`
    );
    const data = await response.json();
    allPokemon = data.results;
    renderPokemon(allPokemon);
  } catch (error) {
    console.error("Could not fetch pokemon");
  }
};
getPokemon();

async function getPokemonNew(id) {
  try {
    const [pokemon, pokemonSpecies] = await Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) =>
        res.json()
      ),
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((res) =>
        res.json()
      ),
    ]);
    return true;
  } catch (error) {
    console.error("Couldnt fetch pokemon");
  }
}

function renderPokemon(pokemonArray) {
  listWrapper.textContent = "";

  pokemonArray.forEach((pokemon) => {
    const pokemonID = pokemon.url.split("/")[6];
    // list item structure and classes
    const listItem = document.createElement("div");
    listItem.className = "list-item";
    const numberWrap = document.createElement("div");
    numberWrap.className = "number-wrap";
    const number = document.createElement("p");
    number.className = "caption-fonts";
    number.textContent = `${pokemonID}`;
    const imageWrap = document.createElement("div");
    imageWrap.className = "img-wrap";
    const image = document.createElement("img");
    image.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonID}.png`;
    const nameWrap = document.createElement("div");
    nameWrap.className = "name-wrap";
    const name = document.createElement("p");
    name.className = "body3-fonts";
    name.textContent = `${pokemon.name}`;

    numberWrap.append(number);
    imageWrap.append(image);
    nameWrap.append(name);
    listItem.append(numberWrap, imageWrap, nameWrap);

    listWrapper.append(listItem);
  });
}

searchInput.addEventListener("keyup", handleSearch);

function handleSearch() {
  const searchTerm = searchInput.value.toLowerCase();
  let filteredPokemonList;

  if (numberFilter.checked) {
    filteredPokemonList = allPokemon.filter((pokemon) => {
      const pokemonID = pokemon.url.split("/")[6];
      return pokemonID.startsWith(searchTerm);
    });
  } else if (nameFilter.checked) {
    filteredPokemonList = allPokemon.filter((pokemon) => {
      return pokemon.name.toLowerCase().startsWith(searchTerm);
    });
  } else {
    filteredPokemonList = allPokemon;
  }
  renderPokemon(filteredPokemonList);

  if (filteredPokemonList.length === 0) {
    notFoundMessage.style.display = "block";
  } else {
    notFoundMessage.style.display = "none";
  }
}

const closeButton = document.querySelector(".search-close-icon");
closeButton.addEventListener("click", clearSearch);

function clearSearch() {
  searchInput.value = "";
  renderPokemon(allPokemon);
  notFoundMessage.style.display = "none";
}
