'use strict';

var step = 5;
var delay = 30;
var whatBrowser = navigator.name;
var createBtn = document.getElementById('create');
var trash = document.getElementById('trash');
var totalBalls = document.getElementById('total');

function BallCreator(trash) {
  var _this2 = this;

  this.step = step;
  this.delay = delay;
  this.isCreated = false;
  this.height = 0;
  this.width = 0;
  this.Hoffset = 0;
  this.Woffset = 0;
  this.pause = true;
  this.name = navigator.name;
  this.interval = null;
  this.browser = whatBrowser === 'Microsoft Internet Explorer';
  this.image = null;
  this.randomPosition = function () {
    var left = Math.floor(Math.random() * window.innerWidth + 1);
    var top = Math.floor(Math.random() * window.innerHeight + 1);
    var yon = Math.floor(Math.random() * (1 - 0 + 1)) + 0;
    var xon = Math.floor(Math.random() * (1 - 0 + 1)) + 0;
    return { left: left, top: top, yon: yon, xon: xon };
  };
  this.yon = this.randomPosition().yon;
  this.xon = this.randomPosition().xon;
  this.yPos = this.randomPosition().top;
  this.xPos = this.randomPosition().left;
  this.changePosition = function () {
    if (_this2.browser) {
      _this2.width = document.body.clientWidth;
      _this2.height = document.body.clientHeight;
      _this2.Hoffset = _this2.image.offsetHeight;
      _this2.Woffset = _this2.image.offsetWidth;
      _this2.image.style.left = _this2.xPos + document.body.scrollLeft + 'px';
      _this2.image.style.top = _this2.yPos + document.body.scrollTop + 'px';
    } else {
      _this2.height = window.innerHeight;
      _this2.width = window.innerWidth;
      _this2.Hoffset = 50;
      _this2.Woffset = 50;
      _this2.image.style.top = _this2.yPos + window.pageYOffset + 'px';
      _this2.image.style.left = _this2.xPos + window.pageXOffset + 'px';
    }
    if (_this2.yon) {
      _this2.yPos = _this2.yPos + _this2.step;
    } else {
      _this2.yPos = _this2.yPos - _this2.step;
    }
    if (_this2.yPos < 0) {
      _this2.yon = 1;
      _this2.yPos = 0;
    }
    if (_this2.yPos >= _this2.height - _this2.Hoffset) {
      _this2.yon = 0;
      _this2.yPos = _this2.height - _this2.Hoffset;
    }
    if (_this2.xon) {
      _this2.xPos = _this2.xPos + _this2.step;
    } else {
      _this2.xPos = _this2.xPos - _this2.step;
    }
    if (_this2.xPos < 0) {
      _this2.xon = 1;
      _this2.xPos = 0;
    }
    if (_this2.xPos >= _this2.width - _this2.Woffset) {
      _this2.xon = 0;
      _this2.xPos = _this2.width - _this2.Woffset;
    }
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
  this.createImgItem = function () {
    _this2.isCreated = true;
    var img = document.createElement('img');
    img.setAttribute('class', 'img-item');
    img.setAttribute('src', 'img/ball.png');
    img.setAttribute('alt', 'ball');
    img.style.visibility = 'hidden';
    document.body.appendChild(img);
    _this2.image = img;
    setTimeout(function () {
      _this2.image.style.visibility = 'visible';
    }, 400);
    getImgLength();
    var _this = _this2;
    _this2.image.onmousedown = function (e) {
      var _this3 = this;

      var cords = _this.getCoords(this);
      var shiftX = e.pageX - cords.left;
      var shiftY = e.pageY - cords.top;
      document.body.appendChild(this);
      moveBall(e);
      this.style.zIndex = 1000;
      function moveBall(e) {
        _this.image.style.left = e.pageX - shiftX + 'px';
        _this.image.style.top = e.pageY - shiftY + 'px';
        _this.xPos = e.pageX - shiftX;
        _this.yPos = e.pageY - shiftY;
      }
      _this.pauseResume();
      document.onmousemove = function (e) {
        moveBall(e);
        if (_this.checkIfAbove(trash, _this3)) {
          _this.image.classList.add('delete');
        } else {
          _this.image.classList.remove('delete');
        }
      };
      this.onmouseup = function () {
        document.onmousemove = null;
        _this3.onmouseup = null;
        if (_this.checkIfAbove(trash, _this3)) {
          _this3.remove();
          getImgLength();
        }
        _this.pauseResume();
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