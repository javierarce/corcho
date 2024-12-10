class Backdrop {
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

  onClick(event) {
    event.preventDefault();
    event.stopPropagation();

    this.$element.dispatchEvent(new CustomEvent("backdrop-click"));
  }

  render() {
    this.$element = document.createElement("div");
    this.$element.classList.add(this.className);

    this.$element.onclick = this.onClick.bind(this);

    document.body.appendChild(this.$element);
  }
}
