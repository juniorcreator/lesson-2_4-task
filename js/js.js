let step = 5;
let delay = 30;
let createBtn = document.getElementById('create');
let trash = document.getElementById('trash');
let totalBalls = document.getElementById('total');

function BallCreator(trash) {
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
  this.randomPosition = () => {
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
  this.moveConditions = () => {
    this.ballPos.yPos = this.ballPos.yon
        ? this.ballPos.yPos + this.step
        : this.ballPos.yPos - this.step;
    this.ballPos.xPos = this.ballPos.xon
        ? this.ballPos.xPos + this.step
        : this.ballPos.xPos - this.step;

    if (this.ballPos.yPos < 0) {
      this.ballPos.yon = 1;
      this.ballPos.yPos = 0;
    }
    if (this.ballPos.yPos >= (this.ballOptions.height - this.ballOptions.Hoffset)) {
      this.ballPos.yon = 0;
      this.ballPos.yPos = (this.ballOptions.height - this.ballOptions.Hoffset);
    }
    if (this.ballPos.xPos < 0) {
      this.ballPos.xon = 1;
      this.ballPos.xPos = 0;
    }
    if (this.ballPos.xPos >= (this.ballOptions.width - this.ballOptions.Woffset)) {
      this.ballPos.xon = 0;
      this.ballPos.xPos = (this.ballOptions.width - this.ballOptions.Woffset);
    }
  };
  this.changePosition = () => {
    this.ballOptions.height = window.innerHeight;
    this.ballOptions.width = window.innerWidth;
    this.ballOptions.Hoffset = 50;
    this.ballOptions.Woffset = 50;
    this.image.style.top = this.ballPos.yPos + window.pageYOffset + 'px';
    this.image.style.left = this.ballPos.xPos + window.pageXOffset + 'px';
    this.moveConditions();
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
  this.addBallToDoom = () => {
    this.isCreated = true;
    let img = document.createElement('img');
    img.setAttribute('class', 'img-item');
    img.setAttribute('src', 'img/ball.png');
    img.setAttribute('alt', 'ball');
    img.style.visibility = 'hidden';
    document.body.appendChild(img);
    this.image = img;
  };
  this.handleMouseup = (context) => {
    document.onmousemove = null;
    context.onmouseup = null;
    if (this.checkIfAbove(trash, context)) {
      context.remove();
      getImgLength();
    }
    this.pauseResume();
  };
  this.handleMousemove = (e, context, shiftX, shiftY) => {
    this.moveBall(e, shiftX, shiftY);
    if (this.checkIfAbove(trash, context)) {
      this.image.classList.add('delete');
    } else {
      this.image.classList.remove('delete');
    }
  };
  this.moveBall = (e, shiftX, shiftY) => {
    this.image.style.left = e.pageX - shiftX + 'px';
    this.image.style.top = e.pageY - shiftY + 'px';
    this.ballPos.xPos = e.pageX - shiftX;
    this.ballPos.yPos = e.pageY - shiftY;
  };
  this.createImgItem = () => {
    let _this = this;
    this.addBallToDoom();
    setTimeout(() => {this.image.style.visibility = 'visible'},400);
    getImgLength();
    this.image.onmousedown = function (e) {
      let cords = _this.getCoords(this);
      let shiftX = e.pageX - cords.left;
      let shiftY = e.pageY - cords.top;
      document.body.appendChild(this);
      _this.moveBall(e, shiftX, shiftY);
      _this.pauseResume();
      document.onmousemove = (e) => {
        _this.handleMousemove(e, this, shiftX, shiftY);
      };
      this.onmouseup = () => {
        _this.handleMouseup(this);
      };
    };
    this.image.ondragstart = function () { return false };
  };
  this.start = () => {
    if (!this.isCreated) { this.createImgItem(); }
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

