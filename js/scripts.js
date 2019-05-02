(function () {

  var pokemonRepository = (function () {

    // this contains all of the pokemons
    var repository = [];
    var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';
    
    // properties of a valid object in the repository
    var requiredProperties = ['name', 'detailsUrl'];

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

    function loadList() {
      return fetch(apiUrl)
        .then(function (response) {
          // this returns a promise
          return response.json();
        })
        .then(function(json) {
          json.results.forEach(function(item) {
            var pokemon = {
              name: item.name,
              detailsUrl: item.url
            };
            add(pokemon);
          });
        })
        .catch(function (e) {
          console.error(e);
        })
    }

    // exposed public functions
    return {
      add: add,
      getAll: getAll,
      filter: filter,
      loadList: loadList
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

  // the the <ul> element where to append all the <li> elements
  // each representing a pokemon card
  var $pokemonsListContainer = document.querySelector('.pokemon-list');
  
  if ($pokemonsListContainer) {
    // if the <ul> is existing, load the data from server and 
    // then populate the list with pokemons from the repository

    // load the repository from the server to the repository
    pokemonRepository.loadList()
      .then(function() {
        // Now the data is loaded!
        // If there are any pokemons and the list container
      // exists, go through all of them and append them to it
        pokemonRepository.getAll().forEach(function(pokemon) {
        // append each pokemon to the specified <ul> element
        addListItem(pokemon, $pokemonsListContainer);
      });  
                    });
  }
  
})();
