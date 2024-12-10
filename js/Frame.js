class Frame {
  constructor(data, path) {
    this.imagePath = path;
    this.isMouseDown = false;
    this.data = data;
    this.comments = data.comments;
  }

  getID() {
    return this.data.id;
  }

  getWidth() {
    return this.image.getBoundingClientRect().width;
  }

  getHeight() {
    return this.image.getBoundingClientRect().height;
  }

  remove() {
    this.hide();

    setTimeout(() => {
      this.image.remove();
    }, 400);
  }

  setPosition(x, y) {
    this.image.style.left = `${x}px`;
    this.image.style.top = `${y}px`;
  }

  show() {
    return new Promise((resolve) => {
      this.image.dispatchEvent(new CustomEvent("comments-hide"));

      if (this.comments) {
        this.image.dispatchEvent(
          new CustomEvent("comments-show", {
            detail: { comments: this.comments },
          }),
        );
      }
      this.image.classList.add("is-visible");
      resolve(this);
    });
  }

  hide() {
    return new Promise((resolve) => {
      this.image.classList.remove("is-visible");
      resolve(this);
    });
  }

  load() {
    return new Promise(async (resolve) => {
      this.image = new Image();

      this.image.onload = () => {
        this.image.draggable = false;
        resolve(this);
      };

      this.image.src = `/${this.imagePath}/${this.data.page}/${this.data.filename}?${Date.now()}`;
    });
  }
}
