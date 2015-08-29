// start slingin' some d3 here.
do{
  var playerNum = +prompt("How many players do you want to play with? (1-4)");
} while (playerNum % 1 !== 0 || playerNum < 1 || playerNum > 4);

var gameOptions = {
  width: 1000,
  height: 500,
  numEnemies: 25,
  speed: 1000
};

var gameboard = d3.select('.container').append('svg').attr('width', gameOptions.width)
  .attr('height', gameOptions.height).classed('gameboard',true);

var Player = function(x, y, color){
  this.x = x;
  this.y = y;
  this.color = color;
  this.score = 0;
  this.highScore = 0;
  this.increaseScore();
};

Player.prototype.increaseScore = function(){
  this.score++;
  this.highScore = Math.max(this.score, this.highScore);
  setTimeout(this.increaseScore.bind(this), 1000);
};
var colors = ['red', 'blue', 'orange', 'green'];
var players = [];
for(var i = 0; i < playerNum; i++){
  players[i] = new Player(((i + 1) * gameOptions.width)/(playerNum + 1), gameOptions.height/2, colors[i]);
}

var playerCircles = gameboard.selectAll()
  .data(players)
  .enter()
  .append('circle')
  .attr({
    'cx': function(d){return d.x;},
    'cy': function(d){return d.y;},
    'r': 10,
    'id': function(d){return d.color;}
  })
  .style('fill', function(d){return d.color;});

var drag = d3.behavior.drag().on('drag',function() {
  d3.select(this).attr({
    'cx': Math.min(Math.max(d3.event.x, 10), gameOptions.width - 10),
    'cy': Math.min(Math.max(10, d3.event.y), gameOptions.height - 10)
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
      r:10,
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
var enemySquares = gameboard.selectAll('rect')
  .data(enemies)
  .enter()
  .append('rect')
  .attr({
    'x': function(d) {return d.x;},
    'y': function(d) {return d.y;},
    'width': function(d) {return 2*d.r;},
    'height': function(d) {return 2*d.r;},
    'id': function(d) {return d.index;}
  })
  .style('fill', 'purple');

var checkCollision = function() {
  d3.selectAll('circle').each(function(d) {
    var totalRadius = 20;
    var playerX = d3.select('#' + d.color).attr('cx');
    var playerY = d3.select('#' + d.color).attr('cy');
    d3.selectAll('rect').each(function(enemy) {
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


