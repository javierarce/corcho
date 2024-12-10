class Thumb {
  constructor(frame, path, index) {
    this.className = this.constructor.name.toLowerCase();
    this.frame = frame;
    this.pageIndex = index;
    this.imagePath = path;
  }

  unselect() {
    this.$element.classList.remove("is-selected");
    this.$element.blur();
  }

  select() {
    this.$element.dispatchEvent(
      new CustomEvent("thumb-selected", { detail: { id: this.pageIndex } }),
    );
    this.$element.classList.add("is-selected");
    this.$element.focus();
  }

  bindEvents() {
    this.$element.onclick = () => {
      this.click();
    };

    this.$element.addEventListener("focus", () => {
      this.select();
    });

    this.$element.addEventListener("mousemove", () => {
      this.select();
    });
  }

  click() {
    this.$element.dispatchEvent(
      new CustomEvent("thumb-clicked", { detail: { id: this.pageIndex } }),
    );
  }

  render() {
    this.$element = document.createElement("button");
    this.$element.classList.add(this.className);

    this.$element.setAttribute("tabindex", "0");
    this.$element.setAttribute("aria-label", `Thumbnail ${this.pageIndex + 1}`);

    this.$title = document.createElement("span");
    this.$title.classList.add(`${this.className}__title`);
    this.$title.textContent = this.frame.page;

    this.load().then(() => {
      this.$element.appendChild(this.image);
      this.$element.appendChild(this.$title);
    });

    this.bindEvents();
    return this.$element;
  }

  load() {
    return new Promise(async (resolve) => {
      this.image = new Image();
      this.image.onload = () => {
        this.image.draggable = false;
        resolve(this);
      };
      this.image.src = `${this.imagePath}/${this.frame.page}/${this.frame.filename}?${Date.now()}`;
    });
  }
}
