'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _eventemitter = require('eventemitter2');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TouchController = function (_EventEmitter) {
  _inherits(TouchController, _EventEmitter);

  function TouchController() {
    var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, TouchController);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TouchController).call(this));

    _this.element = opts.element || document;
    _this.touchstartElement = opts.touchstartElement || _this.element;
    _this.touchmoveElement = opts.touchmoveElement || _this.element;
    _this.touchendElement = opts.touchendElement || _this.element;

    _this.doubleTapDelay = opts.doubleTapDelay || 500;
    _this.holdingDelay = opts.holdingDelay || 1000;
    _this.watchInterval = opts.watchInterval || 100;

    _this.touchSupport = 'ontouchstart' in window;
    _this.touchstart = _this.touchSupport ? 'touchstart' : 'mousedown';
    _this.touchmove = _this.touchSupport ? 'touchmove' : 'mousemove';
    _this.touchend = _this.touchSupport ? 'touchend' : 'mouseup';

    _this.deltaX = 0;
    _this.deltaY = 0;
    _this.moveX = 0;
    _this.moveY = 0;

    _this.defineEventListener();
    _this.setEvent();
    return _this;
  }

  _createClass(TouchController, [{
    key: 'setEvent',
    value: function setEvent() {
      this.touchstartElement.addEventListener(this.touchstart, this.onTouchStart, false);
      this.touchmoveElement.addEventListener(this.touchmove, this.onTouchMove, false);
      this.touchendElement.addEventListener(this.touchend, this.onTouchEnd, false);
      // document.addEventListener(touchstart, function(){ return false; }, false); // disableDocumentTouch
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.touchstartElement.removeEventListener(this.touchstart, this.onTouchStart, false);
      this.touchmoveElement.removeEventListener(this.touchmove, this.onTouchMove, false);
      this.touchendElement.removeEventListener(this.touchend, this.onTouchEnd, false);
    }
  }, {
    key: 'defineEventListener',
    value: function defineEventListener() {
      var _this2 = this;

      var watchTimer = void 0;
      var delayTimer = void 0;

      this.onTouchStart = function (evt) {
        evt.preventDefault(); // enablePreventDefault
        evt.stopPropagation(); // enableStopPropagation

        _this2.isDoubleTap = _this2.isTap;
        _this2.isDragging = true;
        _this2.isTap = true;
        _this2.touchStartTime = Date.now();

        _this2.touchStartX = _this2.touchSupport ? evt.touches[0].pageX : evt.pageX;
        _this2.touchStartY = _this2.touchSupport ? evt.touches[0].pageY : evt.pageY;

        // TODO: watchまわりもうちょっとうまく書きたい
        setTimeout(function () {
          clearInterval(watchTimer);
          watchTimer = setInterval(function () {
            if (!_this2.isTouchMoving) {
              console.log('touchholding');
              _this2.emit('touchholding', _this2);
            }
          }, _this2.watchInterval);
        }, _this2.holdingDelay);

        _this2.emit('touchstart', {
          'touchStartTime': _this2.touchStartTime,
          'touchStartX': _this2.touchStartX,
          'touchStartY': _this2.touchStartY
        });

        //return false; // enableReturnFalse
      };

      this.onTouchMove = function (evt) {
        if (!_this2.isDragging) return;
        _this2.isTouchMoving = true;

        clearTimeout(delayTimer);
        delayTimer = setTimeout(function () {
          _this2.isTouchMoving = false;
        }, _this2.holdingDelay);

        _this2.lasttouchX = _this2.touchX || _this2.touchStartX;
        _this2.lasttouchY = _this2.touchY || _this2.touchStartY;

        _this2.touchX = _this2.touchSupport ? evt.touches[0].pageX : evt.pageX;
        _this2.touchY = _this2.touchSupport ? evt.touches[0].pageY : evt.pageY;
        _this2.deltaX = _this2.touchX - _this2.lasttouchX;
        _this2.deltaY = _this2.touchY - _this2.lasttouchY;
        _this2.moveX = _this2.touchX - _this2.touchStartX;
        _this2.moveY = _this2.touchY - _this2.touchStartY;

        _this2.isTap = _this2.isDoubleTap = false;

        _this2.emit('touchmove', {
          'lasttouchX': _this2.lasttouchX,
          'lasttouchY': _this2.lasttouchY,
          'touchX': _this2.touchX,
          'touchY': _this2.touchY,
          'deltaX': _this2.deltaX,
          'deltaY': _this2.deltaY,
          'moveX': _this2.moveX,
          'moveY': _this2.moveY
        });

        // clearTimeout(movingtimer);
        // movingtimer = setTimeout(function(){ this.isDragging = false; },1000);
      };

      this.onTouchEnd = function (evt) {
        _this2.isDragging = false;
        _this2.isTouchMoving = false;
        clearInterval(watchTimer);

        _this2.elapsedTime = Date.now() - _this2.touchStartTime;
        _this2.touchEndX = _this2.touchX;
        _this2.touchEndY = _this2.touchY;

        _this2.emit('touchend', {
          'elapsedTime': _this2.elapsedTime,
          'touchEndX': _this2.touchEndX,
          'touchEndY': _this2.touchEndY,
          'moveX': _this2.moveX,
          'moveY': _this2.moveY,
          'isTap': _this2.isTap,
          'isDoubleTap': _this2.isDoubleTap
        });

        _this2.touchX = _this2.touchY = null;
        _this2.moveX = _this2.moveY = 0;
        setTimeout(function () {
          _this2.isTap = _this2.isDoubleTap = false;
        }, _this2.doubleTapDelay);
      };
    }
  }]);

  return TouchController;
}(_eventemitter.EventEmitter2);

exports.default = TouchController;