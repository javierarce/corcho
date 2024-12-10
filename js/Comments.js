class Comments {
  constructor() {
    this.className = this.constructor.name.toLowerCase();
    this.isOpen = false;
    this.comments = [];

    this.bindEvents();
    this.render();
  }

  bindEvents() {
    document.body.addEventListener("keydown", this.onKeyDown.bind(this), this);
  }

  onKeyDown(event) {
    let key = event.key;

    if (key == "Escape") {
      this.close();
    }
  }

  show(comments) {
    this.comments = comments;
    this.displayComments();
    this.$element.classList.add("is-visible");
  }

  hide() {
    this.close();
    this.$element.classList.remove("is-visible");
    this.$element.dispatchEvent(new CustomEvent("comments-closed"));
    this.$element.innerHTML = "";
  }

  close() {
    this.comments = [];
    this.isOpen = false;
    this.$element.classList.remove("is-open");
    this.$element.dispatchEvent(new CustomEvent("comments-closed"));
  }

  onClick(event) {
    event.preventDefault();
    event.stopPropagation();

    if (!this.comments.length) {
      return;
    }

    this.isOpen = !this.isOpen;

    this.$element.classList.toggle("is-open", this.isOpen);
    if (this.isOpen) {
      this.$element.dispatchEvent(new CustomEvent("comments-open"));
    } else {
      this.$element.dispatchEvent(new CustomEvent("comments-closed"));
    }
  }

  urlify(text) {
    let urlRegex = /(https?:\/\/[^\s]+)/g;

    return text.replace(urlRegex, function (url) {
      return '<a href="' + url + '" target="_blank">' + url + "</a>";
    });
  }

  displayComments() {
    this.$comment = document.createElement("div");
    this.$comment.classList.add(`${this.className}__comment`);
    this.$comment.onclick = (event) => {
      event.stopPropagation();
    };

    this.comments.forEach((comment) => {
      let $comment = document.createElement("div");
      $comment.classList.add(`${this.className}__commentMessage`);
      $comment.innerHTML = this.urlify(comment).replace("\n", "<br /><br />");
      this.$comment.appendChild($comment);
    });

    this.$badge = document.createElement("div");
    this.$badge.classList.add(`${this.className}__badge`);
    this.$badge.textContent = this.comments.length;
    this.$element.appendChild(this.$badge);
    this.$element.appendChild(this.$comment);

    this.$comment = document.createElement("div");
    this.$comment.classList.add(`${this.className}__comment`);
    this.$comment.onclick = (event) => {
      event.stopPropagation();
    };
    this.$element.classList.add("is-visible");
  }

  render() {
    this.$element = document.createElement("div");
    this.$element.classList.add(this.className);

    this.$element.onclick = this.onClick.bind(this);
    document.body.appendChild(this.$element);
  }
}
