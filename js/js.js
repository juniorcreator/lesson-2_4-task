let step = 5;
let delay = 30;
let whatBrowser = navigator.name;
let createBtn = document.getElementById('create');
let trash = document.getElementById('trash');
let totalBalls = document.getElementById('total');

function BallCreator(trash) {
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
  this.randomPosition = () => {
    let left = Math.floor(Math.random() * window.innerWidth + 1);
    let top = Math.floor(Math.random() * window.innerHeight + 1);
    let yon = Math.floor(Math.random() * (1 - 0 + 1)) + 0;
    let xon = Math.floor(Math.random() * (1 - 0 + 1)) + 0;
    return {left, top, yon, xon};
  };
  this.yon = this.randomPosition().yon;
  this.xon = this.randomPosition().xon;
  this.yPos = this.randomPosition().top;
  this.xPos = this.randomPosition().left;
  this.changePosition = () => {
    if (this.browser) {
      this.width = document.body.clientWidth;
      this.height = document.body.clientHeight;
      this.Hoffset = this.image.offsetHeight;
      this.Woffset = this.image.offsetWidth;
      this.image.style.left = this.xPos + document.body.scrollLeft + 'px';
      this.image.style.top = this.yPos + document.body.scrollTop + 'px';
    } else {
      this.height = window.innerHeight;
      this.width = window.innerWidth;
      this.Hoffset = 50;
      this.Woffset = 50;
      this.image.style.top = this.yPos + window.pageYOffset + 'px';
      this.image.style.left = this.xPos + window.pageXOffset + 'px';
    }
    if (this.yon) {
      this.yPos = this.yPos + this.step;
    }
    else {
      this.yPos = this.yPos - this.step;
    }
    if (this.yPos < 0) {
      this.yon = 1;
      this.yPos = 0;
    }
    if (this.yPos >= (this.height - this.Hoffset)) {
      this.yon = 0;
      this.yPos = (this.height - this.Hoffset);
    }
    if (this.xon) {
      this.xPos = this.xPos + this.step;
    }
    else {
      this.xPos = this.xPos - this.step;
    }
    if (this.xPos < 0) {
      this.xon = 1;
      this.xPos = 0;
    }
    if (this.xPos >= (this.width - this.Woffset)) {
      this.xon = 0;
      this.xPos = (this.width - this.Woffset);
    }
  };
  this.checkIfAbove = (trash, image) => {
    trash.offsetBottom = trash.offsetTop + trash.offsetHeight;
    trash.offsetRight = trash.offsetLeft + trash.offsetWidth;
    image.offsetBottom = image.offsetTop + image.offsetHeight;
    image.offsetRight = image.offsetLeft + image.offsetWidth;

    return !((trash.offsetBottom < image.offsetTop) ||
        (trash.offsetTop > image.offsetBottom) ||
        (trash.offsetRight < image.offsetLeft) ||
        (trash.offsetLeft > image.offsetRight))
  };
  this.getCoords = (element) => {
    let box = element.getBoundingClientRect();
    return {
      top: box.top + pageYOffset,
      left: box.left + pageXOffset
    };
  };
  this.pauseResume = () => {
    if (this.pause) {
      clearInterval(this.interval);
      this.pause = false;
    } else {
      this.interval = setInterval(this.changePosition, delay);
      this.pause = true;
    }
  };
  this.createImgItem = () => {
    this.isCreated = true;
    let img = document.createElement('img');
    img.setAttribute('class', 'img-item');
    img.setAttribute('src', 'img/ball.png');
    img.setAttribute('alt', 'ball');
    img.style.visibility = 'hidden';
    document.body.appendChild(img);
    this.image = img;
    setTimeout(() => {this.image.style.visibility = 'visible'},400);
    getImgLength();
    let _this = this;
    this.image.onmousedown = function (e) {
      let cords = _this.getCoords(this);
      let shiftX = e.pageX - cords.left;
      let shiftY = e.pageY - cords.top;
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
      document.onmousemove = (e) => {
        moveBall(e);
        if (_this.checkIfAbove(trash, this)) {
          _this.image.classList.add('delete');
        } else {
          _this.image.classList.remove('delete');
        }
      };
      this.onmouseup = () => {
        document.onmousemove = null;
        this.onmouseup = null;
        if (_this.checkIfAbove(trash, this)) {
          this.remove();
          getImgLength();
        }
        _this.pauseResume();
      };
    };
    this.image.ondragstart = function () {
      return false;
    };
  };
  this.start = () => {
    if (!this.isCreated) {
      this.createImgItem();
    }
    this.interval = setInterval(this.changePosition, delay);
  }
}

const getImgLength = () => {
  let imageItem = document.querySelectorAll('.img-item');
  totalBalls.textContent = imageItem.length;
  return imageItem.length;
};
createBtn.addEventListener('click', () => {
  new BallCreator(trash).start();
});
createBtn.click();

