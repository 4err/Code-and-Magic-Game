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
