/**
 * Объект fireball.
 * @param x координата
 * @param y координата
 * @param direction направление
 * @constructor
 */
function Fireball(x, y, direction) {
  this.startX = x;
  this.startY = y;
  this.direction = direction;
  this.speed = 10;

  this.image = new Image();
  this.image.src = 'img/fireball.gif';
}

Fireball.prototype.draw = function (context) {

  if (this.direction == 'right') {
    context.drawImage(
      this.image,
      this.startX + 50,
      this.startY
    );
  }
  else {
    context.drawImage(
      this.image,
      this.startX + 20,
      this.startY
    );
  }

}

Fireball.prototype.update = function () {
  switch (this.direction) {
    case 'right':
      this.startX += this.speed;
      break;
    case 'left':
      this.startX -= this.speed;
  }
}

module.exports = Fireball;
