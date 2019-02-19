var repository = [
  { name: 'Bulbasaur', height: 0.7, types: ['grass', 'poison'], description: "For some time after its birth, it grows by gaining nourishment from the seed on its back." },
  { name: 'Ivysaur', height: 1, types: ['grass', 'poison'], description: "When the bud on its back starts swelling, a sweet aroma wafts to indicate the flowers coming bloom." },
  { name: 'Venusaur', height: 2, types: ['grass', 'poison'], description: "After a rainy day, the flower on its back smells stronger. The scent attracts other Pokémon." },
  { name: 'Charmander', height: 0.6, types: ['fire'], description: "The fire on the tip of its tail is a measure of its life. If healthy, its tail burns intensely." },
];

document.write('<div class="pokemon-card-container">');

for (var i=0; i<repository.length; i++) {

  document.write('<div class="pokemon-card">');

  document.write('<h2>' + repository[i].name + '</h2>');

  var bigPokemonLabel = repository[i].height > 1 ? ' <i>Wow, that’s big!</i>' : '';
  document.write('<h3>(height: ' + repository[i].height + ')' + bigPokemonLabel + '</h3>');

  for (var j=0; j<repository[i].types.length; j++) {
    var type = repository[i].types[j];
    document.write('<span class="type type-' + type + '">' + type + '</span>');
  }

  document.write('<p><i>' + repository[i].description + '</i></p>');
  
  document.write('</div>');
}

document.write('</div>');
