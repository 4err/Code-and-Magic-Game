/**
 * Движок игры.
 */
"use stirct";

var Game = {};

/**
 * Частота обновления кадров.
 * @type {number}
 */
Game.fps = 60;

/**
 * Инициализация игровой области
 */
Game.initialize = function () {
  this.entities = [];
  this.field = document.getElementById("demo");
  this.context = this.field.getContext("2d");
}

/**
 * Метод отрисовки всех объектов
 */
Game.draw = function () {
  this.context.clearRect(0, 0, this.field.width, this.field.height);

  for (var i = 0; i < this.entities.length; i++) {
    this.entities[i].draw(this.context);
  }
}

/**
 * Метод обновления всех объектов
 */
Game.update = function () {
  for (var i = 0; i < this.entities.length; i++) {
    this.entities[i].update();

    /*Garbage*/
    if (this.entities[i].status === -1) {
      this.entities.splice(i, 1);
    }
  }
}

/**
 * Игровой цикл.
 */
Game.run = (function () {
  var loops = 0,
    skipTicks = 1000 / Game.fps,
    maxFrameSkip = 10,
    nextGameTick = (new Date).getTime();

  return function () {
    loops = 0;

    while ((new Date).getTime() > nextGameTick) {
      Game.update();
      nextGameTick += skipTicks;
      loops++;
    }

    Game.draw();
  };
})();

/**
 * Метод добавления нового объекта в общий список.
 * @param entity
 */
Game.addEntity = function (entity) {
  Game.entities.push(entity);
};

Game.isExistEntity = function (entity) {
  for (var i = 0; i < this.entities.length; i++) {
    this.entities[i].update();
    if (this.entities[i] == entity) {
      return true;
    }
  }
  return false;
};

module.exports = Game;
