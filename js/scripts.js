(function () {

  var pokemonRepository = (function () {

    // this contains all of the pokemons
    var repository = [
      { name: 'Bulbasaur', height: 0.7, types: ['grass', 'poison'], description: "For some time after its birth, it grows by gaining nourishment from the seed on its back." },
      { name: 'Ivysaur', height: 1, types: ['grass', 'poison'], description: "When the bud on its back starts swelling, a sweet aroma wafts to indicate the flowers coming bloom." },
      { name: 'Venusaur', height: 2, types: ['grass', 'poison'], description: "After a rainy day, the flower on its back smells stronger. The scent attracts other Pokémon." },
      { name: 'Charmander', height: 0.6, types: ['fire'], description: "The fire on the tip of its tail is a measure of its life. If healthy, its tail burns intensely." },
    ];
    
    // properties of a valid object in the repository
    var requiredProperties = ['name', 'height', 'types', 'description'];

    function validate(pokemon) {

      // validate the input as an object with the same properties
      // as the ones in the repository

      var result = false;
      var properties = Object.keys(pokemon);      
      var result = (typeof pokemon === 'object')
                && (requiredProperties.length === properties.length)
                && requiredProperties.every(function(property) { return properties.indexOf(property) >= 0; });
                
      return result;      
    }

    function add(pokemon) {
      // add a new pokemon if it's a valid one
      if (validate(pokemon)) {
        repository.push(pokemon);
      } else {
        console.error("Error: you are trying to add a non valid object to the repository");
      }
    }
  
    function getAll() {
      // return the whole repository
      return repository;
    }

    function filter(name) {

      // return the pokemons with the specified name

      function filterByName(pokemon) {
        return pokemon.name === name;
      }      
      
      return repository.filter(filterByName);
    }

    // exposed public functions
    return {
      add: add,
      getAll: getAll,
      filter: filter
    };
  })(); // end of pokemonRepository
  
  function showDetails(pokemon) {
    var name = pokemon.name;
    
    // for the purpose of the exercise, to be removed in the future
    console.log('Pokemon', name);
  }

  function addListItem(pokemon, $pokemonsListContainer) {

    // create and append a pokemon button to the specified <ul> element

    var { name } = pokemon;

    // create main <li> element containing the button
    var $listItemElement = document.createElement('li');
    // add a class to it
    $listItemElement.classList.add('pokemon-list__item');

    // button
    var $pokemonInfoDetailsButton = document.createElement('button');
    // simple text element for the button (the name of the pokemon)
    var $pokemonInfoDetailsButtonText = document.createTextNode(name);
    // add the text element to the button element
    $pokemonInfoDetailsButton.appendChild($pokemonInfoDetailsButtonText);

    // appent the button to the <li> element
    $listItemElement.appendChild($pokemonInfoDetailsButton);

    // appent the <li> element to the DOM, to the specified <ul>
    $pokemonsListContainer.appendChild($listItemElement);

    // add an event listener for the button, which was just appended to the DOM
    $pokemonInfoDetailsButton.addEventListener('click', function(event) {
      showDetails(pokemon);
    });
  }

  function populatePokemonsIntoListContainer(pokemons, $pokemonsListContainer) {
  
    if (pokemons.length > 0 && $pokemonsListContainer) {      
      // if there are any pokemons and the list container
      // exists, go through all of them and append them to it
      pokemons.forEach(function(pokemon) {
        // append each pokemon to the specified <ul> element
        addListItem(pokemon, $pokemonsListContainer);
      });  
    }
  }

  // add a pokemon at runtime
  pokemonRepository.add({ 
                      name: 'Charmeleon', 
                      height: 1.1, 
                      types: ['fire'], 
                      description: "In the rocky mountains where Charmeleon live, their fiery tails shine at night like stars." 
                    });
  
  var pokemons = pokemonRepository.getAll();

  // this is an example of filtering pokemons by name
  // comment out to test it
  //var pokemons = pokemonRepository.filter('Ivysaur');

  // the the <ul> element where to appen all the <li> elements
  // each representing a pokemon card
  var $pokemonsListContainer = document.querySelector('.pokemon-list');

  if (pokemons && $pokemonsListContainer) {
    // if both pokemons and the <ul> are existing, then populate the
    // list with pokemons from the repository
    populatePokemonsIntoListContainer(pokemons, $pokemonsListContainer)
  }
  
})();
