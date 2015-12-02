(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Created by ����� on 02.11.2015.
 */
/**
 * Создание плавной анимации
 * @type {Function}
 */
module.exports = (function (cb) {
  if (window.requestAnimationFrame) {
    return function (cb) {
      var _cb = function () {
        cb();
        requestAnimationFrame(_cb);
      }
      _cb();
    };
  }
  return function (cb) {
    setInterval(cb, 1000 / 60);
  };
});

},{}],2:[function(require,module,exports){
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

},{"./animationFrame.js":1,"./game.js":4,"./interface.js":5,"./key.js":6,"./wizard.js":8}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
/**
 * Created by Денис on 19.11.2015.
 * Объект интерфейса игры.
 */

function Interface() {
  this.health = 5;
  this.mana = 5;

  this.manaImg = new Image();
  this.manaImg.src = 'img/icon-star.png';

  this.emptyManaImg = new Image();
  this.emptyManaImg.src = 'img/icon-star-inactive.png';
};

Interface.prototype.setWizard = function (wizard) {
  this.wizard = wizard;
  this.maxMana = this.wizard.wizardParams.maxMana;
};

Interface.prototype.update = function () {
  this.mana = this.wizard.getMana();
};

Interface.prototype.draw = function (context) {
  for (var i = 0; i < this.maxMana; i++) {
    context.drawImage(
      this.emptyManaImg,
      35 * i,
      100
    );
  }
  for (var i = 0; i < this.mana; i++) {
    context.drawImage(
      this.manaImg,
      35 * i,
      100
    );
  }
};

module.exports = Interface;

},{}],6:[function(require,module,exports){
/**
 * Отлов нажатий клавиш
 */
var Key = {};

var keyCodes = {
  "up": 38,
  "left": 37,
  "right": 39,
  "down": 40,
  "space": 32,
  "shift": 16
}

var keyCodesMap = [37, 38, 39, 40];

Key.map = [];

Key.init = function () {
  onkeydown = onkeyup = function (e) {

    for (var i = 0; i < keyCodesMap.length; i++) {
      if (e.keyCode == keyCodesMap[i]) {
        e.preventDefault();
      }
    }

    e = e || event; // to deal with IE
    Key.map[e.keyCode] = e.type == 'keydown';
  }
}

module.exports.Key = Key;
module.exports.keyCodes = keyCodes;

},{}],7:[function(require,module,exports){
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

},{"./game.js":4}],8:[function(require,module,exports){
/**
 * Описание объекта Маг.
 * @type {exports|module.exports}
 */
var setTimer = require('./timer.js');
var Keys = require('./key.js');
var Key = Keys.Key;
var keyCodes = Keys.keyCodes;

var Fireball = require('./fireball.js');
/**
 * Максимальная длительность прыжка в фрэймах.
 * @type {number}
 */
var JUMP_TIME = 30;

/**
 * Сила прыжка
 * @type {number}
 */
var JUMP_FORCE = 10;

/**
 * Задержка между прыжками.
 * @type {number}
 */
var JUMP_DELAY = 20;

/**
 * Количество действий совершаемых за одну единицу маны.
 * @type {number}
 */
var ACTIONS_PER_MANA = 5;

/**
 * Настройки объекта
 * @constructor
 */
function Wizard() {
  this.wizardImage = new Image();
  this.wizardImage.src = 'img/wizard.png';

  this.direction = 'right';
  this.fly = 0;
  this.canShootFireball = 1;
  this.manaCounter = 0;
  this.needRestoreMana = 0;
  this.restoringMana = 0;

  this.wizardParams = {
    w: 93,
    h: 90,
    x: 0,
    y: 0,
    speed: 5,
    mass: 5,
    mana: 5,
    maxMana: 5
  };

  this.jumpParams = {
    force: JUMP_FORCE,
    time: JUMP_TIME,
    delay: JUMP_DELAY,
    minHeight: JUMP_TIME / 3,
    currJumpTime: 0
  };

  /*Границы мира*/
  this.leftBorder = 0;
  this.rightBorder = 1024 - this.wizardParams.w;
  this.floor = 0;

  this.fireballsArray = [];
}

/**
 * Отрисовка мага
 * @param context
 */
Wizard.prototype.drawWizard = function (context) {
  if (this.direction == 'right') {
    context.drawImage(
      this.wizardImage,
      0,
      0,
      this.wizardParams.w,
      this.wizardParams.h,
      this.wizardParams.x,
      this.wizardParams.y,
      this.wizardParams.w,
      this.wizardParams.h);
  }
  else {
    context.drawImage(
      this.wizardImage,
      0 + this.wizardParams.w,
      0,
      this.wizardParams.w,
      this.wizardParams.h,
      this.wizardParams.x,
      this.wizardParams.y,
      this.wizardParams.w,
      this.wizardParams.h);
  }
};

/**
 * Метод проверки гравитации.
 */
Wizard.prototype.checkGravitation = function () {
if (!(Key.map[keyCodes.shift] && Key.map[keyCodes.up])) {
  if (this.wizardParams.y < this.floor) {
    this.wizardParams.y += this.wizardParams.mass;
    this.fly = 1;
  }

  if (this.wizardParams.y > this.floor) {
    this.wizardParams.y = this.floor;
  }

  if (this.wizardParams.y === this.floor) {
    this.fly = 0;

    if (this.jumpParams.delay > 0) {
      this.jumpParams.delay--;
    }
    else {
      this.jumpParams.currJumpTime = 0;
      this.jumpParams.delay = JUMP_DELAY;
    }
  }
}
};

/**
 * Метод перемещения мага
 * @param direction направление движения
 */
Wizard.prototype.moveTo = function (direction) {
  switch (direction) {
    case 'right':
      this.direction = 'right';
      if (this.wizardParams.x < this.rightBorder) {
        this.wizardParams.x += this.wizardParams.speed;
      }
      break;
    case 'left':
      this.direction = 'left';
      if (this.wizardParams.x > this.leftBorder) {
        this.wizardParams.x -= this.wizardParams.speed;
      }
  }
};

/**
 * Метод прыжка.
 */
Wizard.prototype.jump = function () {
  if (this.jumpParams.currJumpTime < this.jumpParams.time) {
    var force = this.jumpParams.force - ((this.jumpParams.currJumpTime / (this.jumpParams.force)) * 2 | 0);
    this.wizardParams.y -= force;
    this.jumpParams.currJumpTime++;
  }
};

/**
 * Метод полета.
 */
Wizard.prototype.fly = function () {
  if (this.jumpParams.currJumpTime < this.jumpParams.time) {
    var force = this.jumpParams.force - ((this.jumpParams.currJumpTime / (this.jumpParams.force)) * 2 | 0);
    this.wizardParams.y -= force;
    this.jumpParams.currJumpTime++;
  }
};

/**
 * Выстрел файрболлом
 */
Wizard.prototype.fireball = function () {
  this.canShootFireball = 0;
  var fireball = new Fireball(this.wizardParams.x, this.wizardParams.y, this.direction);
  this.fireballsArray.push(fireball);

  setTimer(function () {
    this.canShootFireball = 1;
  }.bind(this), 20);
  setTimer(function () {
    this.fireballsArray.shift();
  }.bind(this), 60);
};

/**
 * Обработка нажатий клавиш
 */
Wizard.prototype.keyBindings = function () {
  if (Key.map[keyCodes.right]) {
    this.moveTo('right');
  }
  if (Key.map[keyCodes.left]) {
    this.moveTo('left');
  }
  if (Key.map[keyCodes.up]) {
    this.jump();
  }
  if ((!Key.map[keyCodes.up]) && this.fly && (this.jumpParams.currJumpTime <= this.jumpParams.minHeight)) {
    this.jump();
  }
  if ((!Key.map[keyCodes.up]) && this.fly && (this.jumpParams.currJumpTime > this.jumpParams.minHeight)) {
    this.jumpParams.currJumpTime = JUMP_TIME;
  }

  if (Key.map[keyCodes.space]) {
    if (this.canShootFireball) {
      this.manaConsumption(this.fireball.bind(this));
    }
  }
};

/**
 * Установка высоты пола для мага.
 * @param y
 */
Wizard.prototype.setFloor = function (y) {
  this.wizardParams.y = this.floor = y - this.wizardParams.h;
};

/**
 * Обертка для отслеживания потребления маны.
 * @param action функция выполнения.
 */
Wizard.prototype.manaConsumption = function (action) {
  if (this.wizardParams.mana > 0) {
    if (this.manaCounter < ACTIONS_PER_MANA) {
      this.manaCounter++;
    } else {
      this.wizardParams.mana--;
      this.manaCounter = 0;
    }

    action();
  } else {
    if (!this.needRestoreMana && !this.restoringMana) {
      console.log('work')
      this.needRestoreMana = 1;
    }
  }
};

/**
 * Получение текущего значения маны
 * @returns {number}
 */
Wizard.prototype.getMana = function () {
  return this.wizardParams.mana;
};

//Wizard.prototype.checkMana = function () {
//if (this.needRestoreMana && !this.restoringMana) {
//  this.restoringMana = 1;
//  for (var i = 0; i < this.wizardParams.maxMana; i++) {
//    setTimer(function () {
//      this.wizardParams.mana++;
//    }.bind(this), 60);
//  }
//
//  //this.needRestoreMana = 0;
//  //this.restoringMana = 0;
//}
//
//this.needRestoreMana = 0;
//this.restoringMana = 0;
//};

/**
 * Отрисовка объекта
 * @param context
 */
Wizard.prototype.draw = function (context) {
  this.drawWizard(context);

  this.fireballsArray.forEach(function (item) {
    item.draw(context);
  });

};

/**
 * Обновление объекта.
 */
Wizard.prototype.update = function () {
  this.checkGravitation();
  this.keyBindings();
  //this.checkMana();

  this.fireballsArray.forEach(function (item) {
    item.update();
  });
};

module.exports = Wizard;

},{"./fireball.js":3,"./key.js":6,"./timer.js":7}]},{},[2]);
