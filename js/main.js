(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use stirct";

(function() {

  var Game = require('./game.js');
  var Key = require('./key.js').Key;
  var Wizard = require('./wizard.js');

  var demo_container = document.querySelector(".demo");
  console.log(Game);
  Game.initialize();
  Key.init();

  var wizard = new Wizard();

  Game.addEntity(wizard);

  Game.run = (function() {
    var loops = 0,
      skipTicks = 1000 / Game.fps,
      maxFrameSkip = 10,
      nextGameTick = (new Date).getTime();

    return function() {
      loops = 0;

      while ((new Date).getTime() > nextGameTick) {
        Game.update();
        nextGameTick += skipTicks;
        loops++;
      }

      Game.draw();
    };
  })();

  (function() {
    var onEachFrame;
    if (window.requestAnimationFrame) {
      onEachFrame = function(cb) {
        var _cb = function() {
          cb();
          requestAnimationFrame(_cb);
        }
        _cb();
      };
    } else {
      onEachFrame = function(cb) {
        setInterval(cb, 1000 / 60);
      }
    }

    window.onEachFrame = onEachFrame;
  })();

  window.onEachFrame(Game.run);

})();

},{"./game.js":2,"./key.js":3,"./wizard.js":4}],2:[function(require,module,exports){
"use stirct";

//module.exports = function() {
  var Game = {};
  Game.fps = 60;
  Game.initialize = function() {
    this.entities = [];
    this.field = document.getElementById("demo");
    this.context = this.field.getContext("2d");
  }

  Game.draw = function() {
    this.context.clearRect(0, 0, this.field.width, this.field.height);

    for (var i = 0; i < this.entities.length; i++) {
      this.entities[i].draw(this.context);
    }
  }

  Game.update = function() {
    for (var i = 0; i < this.entities.length; i++) {
      this.entities[i].update();
    }
  }

  Game.addEntity = function(entity) {
    Game.entities.push(entity);
  };

//  return Game;
module.exports = Game;
//}

},{}],3:[function(require,module,exports){
  var Key = {};

  var keyCodes = {
    "up": 38,
    "left": 37,
    "right": 39,
    "down": 40,
  }

  var keyCodesMap = [37, 38, 39, 40];

  Key.map = [];

  Key.init = function() {
    onkeydown = onkeyup = function(e) {

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

},{}],4:[function(require,module,exports){
  var Game = require('./game.js');
  var Keys = require('./key.js');
  var Key = Keys.Key;
  var keyCodes = Keys.keyCodes;
  var JUMP_TIME = 30;

  function Wizard() {
    this.w = 93;
    this.h = 90;
    this.speed = 5;
    this.image = new Image();
    this.image.src = 'img/wizard.png';
    this.direction = 'right';
    this.x = 0;
    this.y = Game.field.height - this.h;
    console.log(this.y, Game.field.height);
    this.mass = 5;
    this.jumpForce = 10;
    this.jumpTime = JUMP_TIME;
    this.leftBorder = 0;
    this.rightBorder = Game.field.width - this.w;
    this.floor = Game.field.height - this.h;
  }

  Wizard.prototype.draw = function(context) {
    if (this.direction == 'right') {
      context.drawImage(
        this.image,
        0,
        0,
        this.w,
        this.h,
        this.x,
        this.y,
        this.w,
        this.h);
    } else {
      context.drawImage(
        this.image,
        0 + this.w,
        0,
        this.w,
        this.h,
        this.x,
        this.y,
        this.w,
        this.h);
    }
  }

  Wizard.prototype.checkGravitation = function() {

    if (this.y < this.floor) {
      this.y += this.mass;
    }

    if (this.y > this.floor) {
      this.y = this.floor;
    }

    if (this.y === this.floor) {
      this.jumpTime = JUMP_TIME;
    }

  }

  Wizard.prototype.moveTo = function(direction) {
    switch (direction) {
      case 'right':
        this.direction = 'right';
        if (this.x < this.rightBorder) {
          this.x += this.speed;
        }
        break;
      case 'left':
        this.direction = 'left';
        if (this.x > this.leftBorder) {
          this.x -= this.speed;
        }
    }
  }

  Wizard.prototype.jump = function() {
    if (this.jumpTime > 0) {
      this.y -= this.jumpForce;
      --this.jumpTime;
    }
  }

  Wizard.prototype.update = function() {
    this.checkGravitation();

    if (Key.map[keyCodes.right]) {
      this.moveTo('right');
    }
    if (Key.map[keyCodes.left]) {
      this.moveTo('left');
    }
    if (Key.map[keyCodes.up]) {
      this.jump();
    }
  }

  module.exports = Wizard;

},{"./game.js":2,"./key.js":3}]},{},[1]);
