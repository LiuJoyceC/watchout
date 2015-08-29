// start slingin' some d3 here.
do{
  var playerNum = +prompt("How many players do you want to play with? (1-4)");
} while (playerNum % 1 !== 0 || playerNum < 1 || playerNum > 4);

var gameOptions = {
  width: 1000,
  height: 600,
  numEnemies: 20,
  speed: 1250
};

var gameboard = d3.select('.container').append('svg').attr('width', gameOptions.width)
  .attr('height', gameOptions.height).classed('gameboard',true);

var Player = function(x, y, image, color){
  this.x = x;
  this.y = y;
  this.color = color;
  this.image = image;
  this.imageURL = image + '.gif';
  this.score = 0;
  this.highScore = 0;
  this.increaseScore();
};

Player.prototype.increaseScore = function(){
  this.score++;
  this.highScore = Math.max(this.score, this.highScore);
  setTimeout(this.increaseScore.bind(this), 1000);
};
var playerImages = ['mario', 'yoshi', 'bowser', 'peach'];
var colors =['#F8020F','#00F800','#FFB500','#F8B0B0'];
var players = [];
for(var i = 0; i < playerNum; i++){
  players[i] = new Player(((i + 1) * gameOptions.width)/(playerNum + 1), gameOptions.height/2, playerImages[i], colors[i]);
}

var playerCircles = gameboard.selectAll('.player')
  .data(players)
  .enter()
  .append('image')
  .attr({
    'xlink:href': function(d) {return d.imageURL;},
    'class': 'player',
    'x': function(d){return d.x;},
    'y': function(d){return d.y;},
    'height': 35,
    'width': 35,
    'r': 20,
    'id': function(d){return d.image;}
  });

var drag = d3.behavior.drag().on('drag',function() {
  d3.select(this).attr({
    'x': Math.min(Math.max(d3.event.x, 0), gameOptions.width - 35),
    'y': Math.min(Math.max(0, d3.event.y), gameOptions.height - 35)
  });
});

playerCircles.call(drag);

var scoreBoards = d3.selectAll('.scoreboard')
  .data(players);

scoreBoards.exit().remove();
scoreBoards.style('background-color', function(d){return d.color;});

var updateScore = function(){
  scoreBoards.select('.current').select('span')
    .text(function(d){return d.score;});
  scoreBoards.select('.high').select('span')
    .text(function(d){return d.highScore;});
  setTimeout(updateScore, 1000);

};
updateScore();


var enemyGenerator = function() {
  var enemies = [];
  for (var i = 0; i < gameOptions.numEnemies; i++) {
    var enemy = {
      r: 10,
      x: randomX(),
      y: randomY(),
      index: 'ind' + i
    };
    enemies.push(enemy);
  }
  return enemies;
};

var randomX = function() {
  return Math.random() * gameOptions.width;
};

var randomY = function() {
  return Math.random() * gameOptions.height;
};

var enemies = enemyGenerator();
var enemySquares = gameboard.selectAll('.koopa')
  .data(enemies)
  .enter()
  .append('image')
  .attr({
    'xlink:href': 'koopa shell.png',
    'class': 'koopa',
    'x': function(d) {return d.x;},
    'y': function(d) {return d.y;},
    'width': function(d) {return 2*d.r;},
    'height': function(d) {return 2*d.r;},
    'id': function(d) {return d.index;}
  })
  .style('fill', 'purple');

var checkCollision = function() {
  d3.selectAll('.player').each(function(d) {
    var totalRadius = 20;
    var playerX = d3.select('#' + d.image).attr('x');
    var playerY = d3.select('#' + d.image).attr('y');
    d3.selectAll('.koopa').each(function(enemy) {
      var dx = d3.select('#' + enemy.index).attr('x') - playerX;
      var dy = d3.select('#' + enemy.index).attr('y') - playerY;
      if (Math.sqrt(dx * dx + dy * dy)  < totalRadius) {
        d.score = 0;
      }
    });

  });
  setTimeout(checkCollision, 200);
};

checkCollision();

setInterval(function() {
  enemies.forEach(function(enemy) {
  d3.select('#' + enemy.index)
    .transition()
    .duration(gameOptions.speed)
    .attr({
      'x': randomX(),
      'y': randomY()
    });
  });
}, gameOptions.speed);


