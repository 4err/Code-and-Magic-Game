function Fireball(x, y, direction) {
  this.startX = x;
  this.startY = y;
  this.direction = direction;
  this.lifetime = 100;

  this.image = new Image();
  this.image.src = 'img/fireball.gif';
}

Fireball.prototype.draw = function(context) {
  context.drawImage(
    this.image,
    this.startX + 20,
    this.startY
  );
}

Fireball.prototype.update = function(context) {

}

module.exports = Fireball;
