(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Created by ����� on 02.11.2015.
 */
module.exports = (function(cb) {
    if (window.requestAnimationFrame) {
        return function(cb) {
            var _cb = function() {
                cb();
                requestAnimationFrame(_cb);
            }
            _cb();
        };
    }
    return function(cb) {
        setInterval(cb, 1000 / 60);
    };
});
},{}],2:[function(require,module,exports){
"use stirct";

(function() {

  var Game = require('./game.js');
  var Key = require('./key.js').Key;
  var Wizard = require('./wizard.js');
  var onEachFrame = require('./animationFrame.js')();

  Game.initialize();
  Key.init();

  var wizard = new Wizard();
  wizard.setFloor(Game.field.height);
  Game.addEntity(wizard);

  onEachFrame(Game.run);

})();

},{"./animationFrame.js":1,"./game.js":4,"./key.js":5,"./wizard.js":6}],3:[function(require,module,exports){
function Fireball(x, y, direction) {
  this.startX = x;
  this.startY = y;
  this.direction = direction;
  this.speed = 10;

  this.image = new Image();
  this.image.src = 'img/fireball.gif';
}

Fireball.prototype.draw = function(context) {

  if (this.direction == 'right') {
    context.drawImage(
      this.image,
      this.startX + 50,
      this.startY
    );
  } else {
    context.drawImage(
      this.image,
      this.startX + 20,
      this.startY
    );
  }

}

Fireball.prototype.update = function() {
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
"use stirct";

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
Game.addEntity = function(entity) {
  Game.entities.push(entity);
};

module.exports = Game;

},{}],5:[function(require,module,exports){
  var Key = {};

  var keyCodes = {
    "up": 38,
    "left": 37,
    "right": 39,
    "down": 40,
    "space": 32
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

},{}],6:[function(require,module,exports){
  var Keys = require('./key.js');
  var Key = Keys.Key;
  var keyCodes = Keys.keyCodes;

  var Fireball = require('./fireball.js');

  var JUMP_TIME = 30;
  var JUMP_FORCE = 10;
  var JUMP_DELAY = 20;

  function Wizard() {
    this.wizardImage = new Image();
    this.wizardImage.src = 'img/wizard.png';

    this.direction = 'right';
    this.fly = 0;
    this.canShootFireball = 1;

    this.wizardParams = {
      w: 93,
      h: 90,
      x: 0,
      y: 0,
      speed: 5,
      mass: 5
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
    //    this.drawArray.push(this.drawWizard);
  }

  Wizard.prototype.drawWizard = function(context) {
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
    } else {
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
  }

  Wizard.prototype.checkGravitation = function() {

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
      } else {
        this.jumpParams.currJumpTime = 0;
        this.jumpParams.delay = JUMP_DELAY;
      }
    }

  }

  Wizard.prototype.moveTo = function(direction) {
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
  }

  Wizard.prototype.jump = function() {
    if (this.jumpParams.currJumpTime < this.jumpParams.time) {
      var force = this.jumpParams.force - ((this.jumpParams.currJumpTime / (this.jumpParams.force)) * 2 | 0);
      this.wizardParams.y -= force;
      this.jumpParams.currJumpTime++;
    }
  }

  Wizard.prototype.keyBindings = function() {
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
        this.canShootFireball = 0;
        var fireball = new Fireball(this.wizardParams.x, this.wizardParams.y, this.direction);
        this.fireballsArray.push(fireball);
        setTimeout(function() {
          this.fireballsArray.shift();
        }.bind(this), 1000);
        setTimeout(function() {
          this.canShootFireball = 1;
        }.bind(this), 300);
      }
    }
  }

  Wizard.prototype.setFloor = function(y) {
    this.wizardParams.y = this.floor = y - this.wizardParams.h;
  }

  Wizard.prototype.draw = function(context) {
    this.drawWizard(context);

    this.fireballsArray.forEach(function(item) {
      item.draw(context);
    });

  }

  Wizard.prototype.update = function() {
    this.checkGravitation();
    this.keyBindings();

    this.fireballsArray.forEach(function(item) {
      item.update();
    });
  }

  module.exports = Wizard;

},{"./fireball.js":3,"./key.js":5}]},{},[2]);
