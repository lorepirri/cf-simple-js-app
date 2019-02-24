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
  
  function getPokemonTypeTemplate(type) {
    // template for the type
    return '<span class="type type-' + type + '">' + type + '</span>';
  }

  function getPokemonCardTemplate(name, height, types, description) {

    // template for one single pokemon card

    var template = '<div class="pokemon-card">';
    template += '<h2>' + name + '</h2>';
  
    // if pokemon's height is > 1 then shows "Wow, that’s big!" aside
    var bigPokemonLabel = height > 1 ? ' <i>Wow, that’s big!</i>' : '';
    template += '<h3>(height: ' + height + ')' + bigPokemonLabel + '</h3>';
  
    // list the types of the pokemon (fire, grass, poison, etc.)
    types.forEach(function(type) {
      template += getPokemonTypeTemplate(type);
    });
  
    template += '<p class="description">' + description + '</p>';    
    template += '</div>';
    return template;
  }

  function getPokemonCardTemplateContainer(pokemons) {

    // template for the whole container

    var template = '<div class="pokemon-card-container">';
  
    if (pokemons.length > 0) {
      // if there are any pokemons
      // go through all of them and list them
      pokemons.forEach(function(pokemon) {    
        template += getPokemonCardTemplate(
                        pokemon.name, 
                        pokemon.height, 
                        pokemon.types, 
                        pokemon.description
                      );
      });
    } else {
      // in case there are no pokemons
      template += 'no pokemons in your deck.';
    }
    
    template += '</div>';
    return template;
  }

  // add a pokemon at runtime
  pokemonRepository.add({ 
                      name: 'Charmeleon', 
                      height: 1.1, 
                      types: ['fire'], 
                      description: "In the rocky mountains where Charmeleon live, their fiery tails shine at night like stars." 
                    });
  
  var pokemons = pokemonRepository.getAll();
  //var pokemons = pokemonRepository.filter('Ivysaur');

  // render template of the container (inside there is everything)
  document.write(getPokemonCardTemplateContainer(pokemons));
  
})();
