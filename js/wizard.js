  var Keys = require('./key.js');
  var Key = Keys.Key;
  var keyCodes = Keys.keyCodes;
  var JUMP_TIME = 30;
  var JUMP_FORCE = 10;

  function Wizard() {
//    this.w = 93;
//    this.h = 90;
//    this.speed = 5;
    this.image = new Image();
    this.image.src = 'img/wizard.png';
    this.direction = 'right';
//    this.x = 0;
//    this.y = 0;
//    this.mass = 5;
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
      delay: 3,
      minHeight: JUMP_TIME/2
    };

    /*Границы мира*/
    this.leftBorder = 0;
    this.rightBorder = 1024 - this.wizardParams.w;
    this.floor = 0;
  }

  Wizard.prototype.draw = function(context) {
    if (this.direction == 'right') {
      context.drawImage(
        this.image,
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
        this.image,
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
    }

    if (this.wizardParams.y > this.floor) {
      this.wizardParams.y = this.floor;
    }

    if (this.wizardParams.y === this.floor) {
      this.jumpParams.time = JUMP_TIME;
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
    if (this.jumpParams.time > 0) {
      this.wizardParams.y -= this.jumpParams.force;
      --this.jumpParams.time;
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

  Wizard.prototype.setFloor = function(y) {
    this.wizardParams.y = this.floor = y - this.wizardParams.h;
  }

  module.exports = Wizard;
