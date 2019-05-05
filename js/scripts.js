(function () {
  
  // this is added as prefix to the id of the spinner span
  var BUTTON_SPINNER_ID_PREFIX = 'spinner-'

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

    function loadDetails(pokemon) {
      var url = pokemon.detailsUrl;
      return fetch(url)
        .then(function (response) {
          // this returns a promise
          return response.json();
        })
        .then(function (details) {
          // Now we add the details to the item
          pokemon.imageUrl = details.sprites.front_default;
          pokemon.height = details.height;
          pokemon.types = Object.keys(details.types);
        })
        .catch(function (e) {
          console.error(e);
        });
    }

    // exposed public functions
    return {
      add: add,
      getAll: getAll,
      filter: filter,
      loadList: loadList,
      loadDetails: loadDetails
    };
  })(); // end of pokemonRepository
  

  var modalDetails = (function () {

    var $modalContainer = document.querySelector('#modal-container');

    function show({name, height, imageUrl}) {
      // Clear all existing modal content
      $modalContainer.innerHTML = '';
    
      var $modal = document.createElement('div');
      $modal.classList.add('modal');
    
      // Add the new modal content
      var $closeButtonElement = document.createElement('button');
      $closeButtonElement.classList.add('modal-close');
      $closeButtonElement.innerText = 'Close';
      // add event listener to close the modal
      $closeButtonElement.addEventListener('click', hide);
      
      var $titleElement = document.createElement('h1');
      $titleElement.innerText = name;

      var $imageElement = document.createElement('img');
      $imageElement.setAttribute('src', imageUrl);

      var $contentElement = document.createElement('p');
      $contentElement.innerText = `Height ${height}`;
    
      $modal.appendChild($closeButtonElement);
      $modal.appendChild($titleElement);
      $modal.appendChild($imageElement);
      $modal.appendChild($contentElement);
      $modalContainer.appendChild($modal);
    
      $modalContainer.addEventListener('click', (e) => {
        // Since this is also triggered when clicking INSIDE the modal
        // We only want to close if the user clicks directly on the overlay
        var $target = e.target;
        if ($target === $modalContainer) {
          hide();
        }
      });
      
      $modalContainer.classList.add('is-visible');
    }
    
    function hide() {
      $modalContainer.classList.remove('is-visible');
    }

    function isVisible() {
      return $modalContainer.classList.contains('is-visible');
    }

    // exposed public functions
    return {
      show: show,
      hide: hide,
      isVisible: isVisible
    };
  })(); // end of modalDetails
  

  function showLoadingMessage($listSpinnerSpan) {
    $listSpinnerSpan.classList.add('list-spinner');
  }

  function hideLoadingMessage($listSpinnerSpan) {
    $listSpinnerSpan.classList.remove('list-spinner');
  }

  function showButtonSpinner({name}) {
    var target_id = '#' + BUTTON_SPINNER_ID_PREFIX + name;
    var $spinnerSpan = document.querySelector(target_id);
    if ($spinnerSpan) {
      $spinnerSpan.classList.add('button-spinner');
    }
    return $spinnerSpan
  }
  
  function hideButtonSpinner($spinnerSpan) {
    $spinnerSpan.classList.remove('button-spinner');
  }

  function showDetails(pokemon) {
    // show loading spinner in the button
    var $spinnerSpan = showButtonSpinner(pokemon)
    // load details
    pokemonRepository.loadDetails(pokemon)
      .then(function () {
        // show the modal of the details of the pokemon
        modalDetails.show(pokemon);
      })
      .finally(function () {
        // hide loading spinner in the button
        hideButtonSpinner($spinnerSpan);
      });
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
    // span for the spinner within the button
    var $spinnerSpan = document.createElement('span');
    $spinnerSpan.setAttribute('id', BUTTON_SPINNER_ID_PREFIX + name);

    // add the text element to the button element
    $pokemonInfoDetailsButton.appendChild($pokemonInfoDetailsButtonText);
    // add the span for the spinner
    $pokemonInfoDetailsButton.appendChild($spinnerSpan);

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

    // div for the spinner within the button
    var $listSpinnerDiv = document.createElement('div');
    // appent the div to the <ul>
    $pokemonsListContainer.parentNode.insertBefore($listSpinnerDiv, $pokemonsListContainer);

    // show list loading spinner
    showLoadingMessage($listSpinnerDiv)

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
      })
      .finally(function () {
        // hide list loading spinner
        hideLoadingMessage($listSpinnerDiv);
      });
  }
  
  window.addEventListener('keydown', (e) => {
    // if the user presses the ESC key the modal should be hidden if it is already not
    if (e.key === 'Escape' && modalDetails.isVisible()) {
      modalDetails.hide();  
    }
  });
  
})();
