// start slingin' some d3 here.

var gameOptions = {
  width: 1000,
  height: 500,
  numEnemies: 1,
  speed: 1
};

// Set a container in html file to append the svg in
// var gameboard = d3.select('body').append('div').classed('gameboard', true);
  // set svg and append it to container
var gameboard = d3.select('.container').append('svg').attr('width', gameOptions.width)
  .attr('height', gameOptions.height).classed('gameboard',true);
// play with body styles and background.

// creating a player class
var Player = function(){
  // this.$node = $("<img src='http://icons.iconarchive.com/icons/icons-land/metro-raster-sport/96/Soccer-Ball-icon.png' style= width:" + gameOptions.width + "px;height:" + gameOptions.height + "px>");
  this.x = gameOptions.width/2;
  this.y = gameOptions.height/2;
  this.color = "red";
};

Player.prototype.movePosition = function(dx, dy){
  this.x += dx;
  this.y += dy;
  setPosition(this.x, this.y);
};

Player.prototype.setPosition = function(x, y){
  this.$node.css({top: y, left: x});
};

var player = new Player();
// d3.select('body').data([null, null, player]).enter().append('img').attr('xlink:href', 'asteroid.png');
// d3.select('svg').append('div').classed('player red', true);

// var playerCircle = gameboard.select('circle')
//     .data([player])
//     .enter()
//     .append('circle');

var playerCircle = gameboard.append('circle');
playerCircle.data([player]);

var playerAttribute = playerCircle
  .attr("cx", function(d){return d.x;})
  .attr("cy", function(d){return d.y;})
  .attr("r", 10)
  .attr("class", "player")
  .style("fill", function(d){return d.color;});
// using a createEnemies function to create however many enemies we want.
  // create data for the new Player and the enemies

// Helper functions?
  // 2 separate functions to set a random X and Y coordinate within the bounds
    //of the svg container

// render the gameboard SVG using the data from the Player class and the createEnemies function
