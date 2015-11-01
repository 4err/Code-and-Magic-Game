  var Key = {};

  var keyCodes = {
    "up": 38,
    "left": 37,
    "right": 39,
    "down": 40,
    "ctrl": 17
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
