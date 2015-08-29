// start slingin' some d3 here.
do{
  var playerNum = +prompt("How many players do you want to play with? (1-4)");
} while (playerNum % 1 !== 0 || playerNum < 1 || playerNum > 4);

var gameOptions = {
  width: 1000,
  height: 500,
  numEnemies: 25,
  speed: 500
};

// Set a container in html file to append the svg in
// var gameboard = d3.select('body').append('div').classed('gameboard', true);
  // set svg and append it to container
var gameboard = d3.select('.container').append('svg').attr('width', gameOptions.width)
  .attr('height', gameOptions.height).classed('gameboard',true);
// play with body styles and background.

// creating a player class
var Player = function(x, y, color){
  // this.$node = $("<img src='http://icons.iconarchive.com/icons/icons-land/metro-raster-sport/96/Soccer-Ball-icon.png' style= width:" + gameOptions.width + "px;height:" + gameOptions.height + "px>");
  this.x = x;
  this.y = y;
  this.color = color;
  this.score = 0;
  this.highScore = 0;
  this.increaseScore();
};

// Player.prototype.movePosition = function(dx, dy){
//   this.x += dx;
//   this.y += dy;
//   setPosition(this.x, this.y);
// };

// Player.prototype.setPosition = function(x, y){
//   this.$node.css({top: y, left: x});
// };

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
// d3.select('body').data([null, null, player]).enter().append('img').attr('xlink:href', 'asteroid.png');
// d3.select('svg').append('div').classed('player red', true);

// var playerCircle = gameboard.select('circle')
//     .data([player])
//     .enter()
//     .append('circle');

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
    'cx': d3.event.x,
    'cy': d3.event.y
  });
});

playerCircles.call(drag);
/*d3.selectAll('circle').on('.drag',function() {
  playerCircles.attr({
    'cx': d3.event.x,
    'cy': d3.event.y
  })
});*/

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
    })

  })
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


// using a createEnemies function to create however many enemies we want.
  // create data for the new Player and the enemies

// Helper functions?
  // 2 separate functions to set a random X and Y coordinate within the bounds
    //of the svg container

// render the gameboard SVG using the data from the Player class and the createEnemies function
