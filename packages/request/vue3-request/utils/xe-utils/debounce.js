/**
 * 函数去抖；当被调用 n 毫秒后才会执行，如果在这时间内又被调用则将重新计算执行时间
 *
 * @param {Function} callback 回调
 * @param {Number} wait 多少秒毫
 * @param {Object} options 参数{leading: 是否在之前执行, trailing: 是否在之后执行}
 * @return {Function}
 */
function debounce(callback, wait, options) {
  var args = null;
  var context = null;
  var opts =
    typeof options === "boolean"
      ? { leading: options, trailing: !options }
      : Object.assign({ leading: false, trailing: true }, options);
  var runFlag = false;
  var timeout = null;
  var optLeading = opts.leading;
  var optTrailing = opts.trailing;

  var gcFn = function () {
    args = null;
    context = null;
  };

  var runFn = function () {
    runFlag = true;
    callback.apply(context, args);
    gcFn();
  };

  var endFn = function () {
    if (optLeading === true) {
      timeout = null;
    }
    if (runFlag) {
      gcFn();
      return;
    }
    if (optTrailing === true) {
      runFn();
      return;
    }
    gcFn();
  };

  var cancelFn = function () {
    var rest = timeout !== null;
    if (rest) {
      clearTimeout(timeout);
    }
    gcFn();
    timeout = null;
    runFlag = false;
    return rest;
  };

  var debounced = function () {
    runFlag = false;
    args = arguments;
    context = this;
    if (timeout === null) {
      if (optLeading === true) {
        runFn();
      }
    } else {
      clearTimeout(timeout);
    }
    timeout = setTimeout(endFn, wait);
  };

  debounced.cancel = cancelFn;

  return debounced;
}

export { debounce };
