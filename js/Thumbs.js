class Thumbs {
  constructor(pages, path) {
    this.className = this.constructor.name.toLowerCase();
    this.pages = pages;
    this.path = path;
    this.pageID = 0;
    this.thumbs = [];
    this.currentThumbIndex = -1;
    this.isOpen = false;
  }

  setPageID(id) {
    this.pageID = id;
    this.currentThumbIndex = id;
    this.highlightThumb(this.currentThumbIndex);
  }

  highlightThumb(id) {
    setTimeout(() => this.thumbs[id].select(), 100);
  }

  selectCurrentThumb() {
    if (this.currentThumbIndex === -1) {
      this.currentThumbIndex = this.pageID;
    }
    this.thumbs[this.currentThumbIndex].click();
  }

  next() {
    this.currentThumbIndex = (this.currentThumbIndex + 1) % this.pages.length;
    this.highlightThumb(this.currentThumbIndex);
  }

  prev() {
    this.currentThumbIndex =
      this.currentThumbIndex <= 0
        ? this.pages.length - 1
        : this.currentThumbIndex - 1;
    this.highlightThumb(this.currentThumbIndex);
  }

  show(pageID) {
    this.$element.dispatchEvent(new CustomEvent("thumbs-open"));
    this.setPageID(pageID);
    this.isOpen = true;
    this.$element.classList.add("is-visible");
  }

  hide() {
    this.isOpen = false;
    this.$element.classList.remove("is-visible");
    this.$element.dispatchEvent(new CustomEvent("thumbs-closed"));
    this.currentThumbIndex = -1;
  }
  onThumbSelected(e) {
    this.currentThumbIndex = e.detail.id;
    this.thumbs.forEach((t, i) => {
      if (i !== e.detail.id) {
        t.unselect();
      }
    });
  }

  onThumbClick(e) {
    this.hide();
    // Dispatch click event after hide
    this.$element.dispatchEvent(
      new CustomEvent("thumb-clicked", { detail: { id: e.detail.id } }),
    );
  }
  bindEvents(thumb) {
    thumb.$element.addEventListener(
      "thumb-selected",
      this.onThumbSelected.bind(this),
    );

    thumb.$element.addEventListener(
      "thumb-clicked",
      this.onThumbClick.bind(this),
    );
  }

  addPage() {
    this.pages.forEach((page, index) => {
      const frames = [...page[1]].reverse();
      const frame = frames[0];
      const thumb = new Thumb(frame, this.path, index);

      this.thumbs.push(thumb);

      this.$content.appendChild(thumb.render());
      this.bindEvents(thumb);
    });
  }

  render() {
    this.$element = document.createElement("div");
    this.$inner = document.createElement("div");
    this.$content = document.createElement("div");

    this.$element.classList.add(this.className);
    this.$inner.classList.add(this.className + "__inner");
    this.$content.classList.add(this.className + "__content");

    this.addPage();

    this.$element.appendChild(this.$inner);
    this.$inner.appendChild(this.$content);
    return this.$element;
  }
}
