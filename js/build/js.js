'use strict';

var step = 5;
var delay = 30;
var createBtn = document.getElementById('create');
var trash = document.getElementById('trash');
var totalBalls = document.getElementById('total');

function BallCreator(trash) {
  var _this2 = this;

  this.step = step;
  this.delay = delay;
  this.isCreated = false;
  this.ballOptions = {
    height: 0,
    width: 0,
    Hoffset: 0,
    Woffset: 0
  };
  this.pause = true;
  this.interval = null;
  this.image = null;
  this.randomPosition = function () {
    return {
      left: Math.floor(Math.random() * window.innerWidth + 1),
      top: Math.floor(Math.random() * window.innerHeight + 1),
      yon: Math.floor(Math.random() * 2),
      xon: Math.floor(Math.random() * 2)
    };
  };
  this.ballPos = {
    yon: this.randomPosition().yon,
    xon: this.randomPosition().xon,
    yPos: this.randomPosition().top,
    xPos: this.randomPosition().left
  };
  this.moveConditions = function () {
    _this2.ballPos.yPos = _this2.ballPos.yon ? _this2.ballPos.yPos + _this2.step : _this2.ballPos.yPos - _this2.step;
    _this2.ballPos.xPos = _this2.ballPos.xon ? _this2.ballPos.xPos + _this2.step : _this2.ballPos.xPos - _this2.step;

    if (_this2.ballPos.yPos < 0) {
      _this2.ballPos.yon = 1;
      _this2.ballPos.yPos = 0;
    }
    if (_this2.ballPos.yPos >= _this2.ballOptions.height - _this2.ballOptions.Hoffset) {
      _this2.ballPos.yon = 0;
      _this2.ballPos.yPos = _this2.ballOptions.height - _this2.ballOptions.Hoffset;
    }
    if (_this2.ballPos.xPos < 0) {
      _this2.ballPos.xon = 1;
      _this2.ballPos.xPos = 0;
    }
    if (_this2.ballPos.xPos >= _this2.ballOptions.width - _this2.ballOptions.Woffset) {
      _this2.ballPos.xon = 0;
      _this2.ballPos.xPos = _this2.ballOptions.width - _this2.ballOptions.Woffset;
    }
  };
  this.changePosition = function () {
    _this2.ballOptions.height = window.innerHeight;
    _this2.ballOptions.width = window.innerWidth;
    _this2.ballOptions.Hoffset = 50;
    _this2.ballOptions.Woffset = 50;
    _this2.image.style.top = _this2.ballPos.yPos + window.pageYOffset + 'px';
    _this2.image.style.left = _this2.ballPos.xPos + window.pageXOffset + 'px';
    _this2.moveConditions();
  };
  this.checkIfAbove = function (trash, image) {
    trash.offsetBottom = trash.offsetTop + trash.offsetHeight;
    trash.offsetRight = trash.offsetLeft + trash.offsetWidth;
    image.offsetBottom = image.offsetTop + image.offsetHeight;
    image.offsetRight = image.offsetLeft + image.offsetWidth;

    return !(trash.offsetBottom < image.offsetTop || trash.offsetTop > image.offsetBottom || trash.offsetRight < image.offsetLeft || trash.offsetLeft > image.offsetRight);
  };
  this.getCoords = function (element) {
    var box = element.getBoundingClientRect();
    return {
      top: box.top + pageYOffset,
      left: box.left + pageXOffset
    };
  };
  this.pauseResume = function () {
    if (_this2.pause) {
      clearInterval(_this2.interval);
      _this2.pause = false;
    } else {
      _this2.interval = setInterval(_this2.changePosition, delay);
      _this2.pause = true;
    }
  };
  this.addBallToDoom = function () {
    _this2.isCreated = true;
    var img = document.createElement('img');
    img.setAttribute('class', 'img-item');
    img.setAttribute('src', 'img/ball.png');
    img.setAttribute('alt', 'ball');
    img.style.visibility = 'hidden';
    document.body.appendChild(img);
    _this2.image = img;
  };
  this.handleMouseup = function (context) {
    document.onmousemove = null;
    context.onmouseup = null;
    if (_this2.checkIfAbove(trash, context)) {
      context.remove();
      getImgLength();
    }
    _this2.pauseResume();
  };
  this.handleMousemove = function (e, context, shiftX, shiftY) {
    _this2.moveBall(e, shiftX, shiftY);
    if (_this2.checkIfAbove(trash, context)) {
      _this2.image.classList.add('delete');
    } else {
      _this2.image.classList.remove('delete');
    }
  };
  this.moveBall = function (e, shiftX, shiftY) {
    _this2.image.style.left = e.pageX - shiftX + 'px';
    _this2.image.style.top = e.pageY - shiftY + 'px';
    _this2.ballPos.xPos = e.pageX - shiftX;
    _this2.ballPos.yPos = e.pageY - shiftY;
  };
  this.createImgItem = function () {
    var _this = _this2;
    _this2.addBallToDoom();
    setTimeout(function () {
      _this2.image.style.visibility = 'visible';
    }, 400);
    getImgLength();
    _this2.image.onmousedown = function (e) {
      var _this3 = this;

      var cords = _this.getCoords(this);
      var shiftX = e.pageX - cords.left;
      var shiftY = e.pageY - cords.top;
      document.body.appendChild(this);
      _this.moveBall(e, shiftX, shiftY);
      _this.pauseResume();
      document.onmousemove = function (e) {
        _this.handleMousemove(e, _this3, shiftX, shiftY);
      };
      this.onmouseup = function () {
        _this.handleMouseup(_this3);
      };
    };
    _this2.image.ondragstart = function () {
      return false;
    };
  };
  this.start = function () {
    if (!_this2.isCreated) {
      _this2.createImgItem();
    }
    _this2.interval = setInterval(_this2.changePosition, delay);
  };
}

var getImgLength = function getImgLength() {
  var imageItem = document.querySelectorAll('.img-item');
  totalBalls.textContent = imageItem.length;
  return imageItem.length;
};
createBtn.addEventListener('click', function () {
  new BallCreator(trash).start();
});
createBtn.click();