/**
 * Created by Денис on 17.11.2015.
 * Файл описывающий объект таймер.
 */

var Game = require('./game.js');

/**
 * Объект таймера
 * @param fun функция
 * @param time задержка
 * @constructor
 */
function Timer(fun, time){
  this.duration = time;
  this.fun = fun;
  this.status = 1;
}
/**
 * Метод выполняющийся по обновлению состояния игры
 */
Timer.prototype.update = function(){
    this.duration--;

  if (this.duration === 0) {
    this.status = -1;
    this.duration = -1;
    this.fun();
  }
};
/**
 * Метод отрисовывающий обновления состояния игры
 */
Timer.prototype.draw = function(){
  //Nothing draw
};

setTimer = function(fun, time){
  var timer = new Timer(fun, time);
  Game.addEntity(timer);
};
module.exports = setTimer;
