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

  timeAgo(date) {
    let seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
      return interval + " years ago";
    }

    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
      return interval + " months ago";
    }

    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
      return interval + " days ago";
    }

    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      return interval + " hours ago";
    }

    interval = Math.floor(seconds / 60);
    if (interval > 1) {
      return interval + " minutes ago";
    }

    return Math.floor(seconds) + " seconds ago";
  }

  urlify(text) {
    let urlRegex = /(https?:\/\/[^\s]+)/g;

    return text.replace(urlRegex, function (url) {
      return '<a href="' + url + '" target="_blank">' + url + "</a>";
    });
  }

  addComment(comment) {
    const $comment = document.createElement("div");
    const $message = document.createElement("div");
    const $header = document.createElement("div");
    const $author = document.createElement("div");
    const $date = document.createElement("div");

    $comment.classList.add("comment");
    $header.classList.add("comment__header");
    $message.classList.add("comment__message");
    $author.classList.add("comment__author");
    $date.classList.add("comment__date");

    $message.innerHTML = this.urlify(comment.message).replace(
      "\n",
      "<br /><br />",
    );

    $author.textContent = comment.user;
    $date.textContent = this.timeAgo(comment.created_at);
    $date.title = comment.created_at;

    $header.appendChild($author);
    $header.appendChild($date);
    $comment.appendChild($header);
    $comment.appendChild($message);

    return $comment;
  }

  displayComments() {
    this.$comment = document.createElement("div");
    this.$comment.classList.add(`${this.className}__content`);
    this.$comment.onclick = (event) => {
      event.stopPropagation();
    };

    this.comments.forEach((comment) => {
      this.$comment.appendChild(this.addComment(comment));
    });

    this.$badge = document.createElement("div");
    this.$badge.classList.add(`${this.className}__badge`);
    this.$badge.textContent = this.comments.length;
    this.$element.appendChild(this.$badge);
    this.$element.appendChild(this.$comment);

    this.$comment = document.createElement("div");
    this.$comment.classList.add(`${this.className}__content`);
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
