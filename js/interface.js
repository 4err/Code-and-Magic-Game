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
