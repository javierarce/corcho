class Spinner {
  constructor() {
    this.className = this.constructor.name.toLowerCase();
    this.render();
  }

  show() {
    this.$element.classList.toggle("is-visible", true);
  }

  hide() {
    this.$element.classList.toggle("is-visible", false);
  }

  render() {
    this.$element = document.createElement("div");
    this.$element.classList.add(this.className);
    document.body.appendChild(this.$element);
  }
}
