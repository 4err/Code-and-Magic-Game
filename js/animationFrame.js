/**
 * Created by Δενθρ on 02.11.2015.
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
