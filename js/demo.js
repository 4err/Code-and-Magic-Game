/**
 * Точка входа в приложение. Подключение и инициализация скриптов.
 */
"use stirct";

(function () {

  var Game = require('./game.js');
  var Key = require('./key.js').Key;
  var Wizard = require('./wizard.js');
  var onEachFrame = require('./animationFrame.js')();
  var Interface = require('./interface.js');

  Game.initialize();
  Key.init();

  var wizard = new Wizard();
  wizard.setFloor(Game.field.height);
  Game.addEntity(wizard);

  var interface = new Interface();
  interface.setWizard(wizard);
  Game.addEntity(interface);


  onEachFrame(Game.run);

})();
