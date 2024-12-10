class Pagination {
  constructor(pages) {
    this.className = this.constructor.name.toLowerCase();
    this.pages = pages;
    this.currentPage = 1;
    this.totalPages = pages.length;
    this.render();
  }

  show() {
    this.$element.classList.toggle("is-visible", true);
  }

  hide() {
    this.$element.classList.toggle("is-visible", false);
  }

  select(id) {
    this.currentPage = id + 1;
    this.updateCounter();
  }

  updateCounter() {
    this.$counter.textContent = `${this.currentPage}/${this.totalPages}`;
  }

  updatePages(pages) {
    this.totalPages = pages.length;
    this.currentPage = 1;
    if (pages.length > 1) {
      this.show();
      this.updateCounter();
    } else {
      this.hide();
    }
  }

  render() {
    this.$element = document.createElement("div");
    this.$element.classList.add(this.className);

    this.$counter = document.createElement("div");
    this.$counter.classList.add(`${this.className}__counter`);
    this.updateCounter();

    this.$element.appendChild(this.$counter);
    document.body.appendChild(this.$element);
  }
}
