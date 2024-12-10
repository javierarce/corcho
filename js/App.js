class App {
  constructor() {
    this.spinner = new Spinner();
    this.loading = false;
    this.currentFrames = [];
    this.pages = [];
    this.$canvas = document.querySelector(".canvas");
    this.currentPageID = 0;
    this.currentFrameID = 0;
    this.backdrop = new Backdrop();

    this.comments = new Comments();

    this.handleCommentsShow = this.handleCommentsShow.bind(this);
    this.handleCommentsHide = this.handleCommentsHide.bind(this);

    this.bindEvents();
    this.fetchData();
  }

  bindEvents() {
    document.body.addEventListener("mousemove", this.onMouseMove.bind(this));
    document.body.addEventListener("mouseleave", this.onMouseLeave.bind(this));
    document.body.addEventListener("click", this.onCanvasClick.bind(this));
    document.body.addEventListener("keydown", this.onKeyDown.bind(this));
    document.addEventListener(
      "fullscreenchange",
      this.onFullscreenChange.bind(this),
    );
    this.backdrop.$element.addEventListener("backdrop-click", () => {
      this.comments.close();
    });
    this.bindCommentsEvents();
  }

  bindCommentsEvents() {
    this.comments.$element.addEventListener("comments-open", () => {
      this.backdrop.show();
      document.body.classList.add("comments-open");
    });

    this.comments.$element.addEventListener("comments-closed", () => {
      this.backdrop.hide();
      document.body.classList.remove("comments-open");
    });
  }

  bindFrameEvents(frame) {
    if (this.previousFrame) {
      this.previousFrame.image.removeEventListener(
        "comments-show",
        this.handleCommentsShow,
      );
      this.previousFrame.image.removeEventListener(
        "comments-hide",
        this.handleCommentsHide,
      );
    }

    frame.image.addEventListener("comments-show", this.handleCommentsShow);
    frame.image.addEventListener("comments-hide", this.handleCommentsHide);
  }

  handleCommentsShow(event) {
    if (event && event.detail && event.detail.comments) {
      const comments = event.detail.comments;
      this.comments.show(comments);
    }
  }

  handleCommentsHide() {
    this.comments.hide();
  }

  onFullscreenChange() {
    this.isFullscreen = !!document.fullscreenElement;
    if (this.isFullscreen) {
      document.body.classList.add("is-fullscreen");
    } else {
      document.body.classList.remove("is-fullscreen");
    }
  }

  toggleFullscreen() {
    if (!this.isFullscreen) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen().catch((err) => {
        console.warn(`Error attempting to exit fullscreen: ${err.message}`);
      });
    }
  }

  addThumbnails(pages, path) {
    this.thumbs = new Thumbs(pages, path);
    document.body.appendChild(this.thumbs.render());

    this.thumbs.$element.addEventListener(
      "thumb-clicked",
      this.onThumbClick.bind(this),
    );
    this.thumbs.$element.addEventListener(
      "thumbs-open",
      this.onThumbsOpen.bind(this),
    );
    this.thumbs.$element.addEventListener(
      "thumbs-closed",
      this.onThumbsClosed.bind(this),
    );
  }

  onThumbsOpen() {
    document.body.classList.add("thumbs-open");
  }

  onThumbsClosed() {
    document.body.classList.remove("thumbs-open");
  }

  onThumbClick(event) {
    this.thumbs.hide();

    setTimeout(() => {
      this.currentPageID = +event.detail.id;
      this.thumbs.setPageID(this.currentPageID);
      this.currentFrameID = 0;
      this.loadFramesByPageID(this.currentPageID);
      this.pagination.updatePages(this.currentFrames);
      this.drawFrame(this.currentFrameID);
    }, 200);
  }

  onMouseMove(event) {
    const halfWidth = window.innerWidth / 2;
    if (event.clientX < halfWidth) {
      document.body.classList.remove("cursor-right");
      document.body.classList.add("cursor-left");
    } else {
      document.body.classList.remove("cursor-left");
      document.body.classList.add("cursor-right");
    }
  }

  onMouseLeave() {
    document.body.classList.remove("cursor-left", "cursor-right");
  }

  onCanvasClick(event) {
    if (this.thumbs.isOpen) {
      return;
    }

    const halfWidth = window.innerWidth / 2;
    if (event.clientX < halfWidth) {
      this.loadPrevFrame();
    } else {
      this.loadNextFrame();
    }
  }

  onKeyDown(event) {
    if (this.thumbs.isOpen) {
      switch (event.code) {
        case "Tab":
        case "Space":
          event.preventDefault();
          if (event.shiftKey) {
            this.thumbs.prev();
          } else {
            this.thumbs.next();
          }
          break;

        case "ArrowLeft":
          event.preventDefault();
          this.thumbs.prev();
          break;

        case "ArrowRight":
          event.preventDefault();
          this.thumbs.next();
          break;

        case "Enter":
          event.preventDefault();
          this.thumbs.selectCurrentThumb();
          break;

        case "Escape":
          event.preventDefault();
          this.thumbs.hide();
          break;
      }
      return;
    }

    switch (event.code) {
      case "Space" && event.shiftKey:
        event.preventDefault();
        this.loadPrevFrame();
        break;

      case "ArrowLeft":
        event.preventDefault();
        this.loadPrevFrame();
        break;

      case "ArrowRight":
        event.preventDefault();
        this.loadNextFrame();
        break;

      case "Tab":
        event.preventDefault();
        this.thumbs.show(this.currentPageID);
        break;

      case "Space":
        event.preventDefault();
        this.loadNextFrame();
        break;

      case "KeyR":
        this.fetchData();
        break;

      case "PageDown":
      case "KeyJ":
        this.loadNextPage();
        break;

      case "PageUp":
      case "KeyK":
        this.loadPrevPage();
        break;

      case "KeyF":
        event.preventDefault();
        this.toggleFullscreen();
        break;
      case "Escape":
        if (this.isFullscreen) {
          document.exitFullscreen().catch(console.warn);
        }
        break;
    }
  }

  loadPrevPage() {
    this.currentFrameID = 0;

    if (this.currentPageID === 0) {
      this.currentPageID = this.pages.length;
    }

    this.currentPageID = (this.currentPageID - 1) % this.pages.length;
    this.thumbs.setPageID(this.currentPageID);

    this.loadFramesByPageID(this.currentPageID);
    this.pagination.updatePages(this.currentFrames);
    this.drawFrame(this.currentFrameID);
  }

  loadNextPage() {
    this.currentFrameID = 0;
    this.currentPageID = (this.currentPageID + 1) % this.pages.length;
    this.thumbs.setPageID(this.currentPageID);
    this.loadFramesByPageID(this.currentPageID);
    this.pagination.updatePages(this.currentFrames);
    this.drawFrame(this.currentFrameID);
  }

  loadPrevFrame() {
    if (this.currentFrameID === 0) {
      this.currentFrameID = this.currentFrames.length;
    }

    this.currentFrameID = (this.currentFrameID - 1) % this.currentFrames.length;
    this.pagination.select(this.currentFrameID);
    this.drawFrame(this.currentFrameID);
  }

  loadNextFrame() {
    this.currentFrameID = (this.currentFrameID + 1) % this.currentFrames.length;
    this.pagination.select(this.currentFrameID);
    this.drawFrame(this.currentFrameID);
  }

  updateURL() {
    if (this.currentPageID === 0) {
      window.history.pushState("", this.currentPageID, `/`);
    } else {
      window.history.pushState(
        this.currentPageID,
        this.currentPageID,
        `/${this.currentPageID}`,
      );
    }
  }

  startLoading() {
    document.body.classList.add("is-loading");
    this.loading = true;
    this.spinner.show();
  }

  stopLoading() {
    document.body.classList.remove("is-loading");
    this.loading = false;
    this.spinner.hide();
  }

  showErrorMessage(e) {
    this.stopLoading();
    console.error(`Error loading the data: ${e}`);

    let $error = document.createElement("div");
    $error.classList.add("Error");
    $error.innerHTML = "Oh, no";
    document.body.appendChild($error);
  }

  fetchData() {
    if (this.loading) {
      return;
    }

    this.startLoading();

    fetch(`data.json?v=${Math.random() * 1000}`)
      .then((response) => response.json())
      .then(this.draw.bind(this))
      .catch((e) => {
        this.showErrorMessage(e);
      });
  }

  getCenterPosition(frame) {
    let x = window.innerWidth / 2 - frame.getWidth() / 2;
    let y = window.innerHeight / 2 - frame.getHeight() / 2;

    return { x, y };
  }

  getRandomPosition(img) {
    let imageRect = img.getBoundingClientRect();
    let imageWidth = imageRect.width;
    let imageHeight = imageRect.height;

    let rect = window.document.body.getBoundingClientRect();
    let bodyWidth = Math.max(rect.width, window.innerWidth);
    let bodyHeight = Math.max(rect.height, window.innerHeight);

    let x = Math.round(Math.random() * (bodyWidth - imageWidth));
    let y = Math.round(Math.random() * (bodyHeight - imageHeight));

    return { x, y };
  }

  groupByPage(data) {
    const pages = data.reduce((acc, curr) => {
      if (!acc[curr.page]) {
        acc[curr.page] = [];
      }
      acc[curr.page].push(curr);
      return acc;
    }, {});

    return Object.entries(pages);
  }

  async draw(data) {
    let md5 = data.md5;

    if (this.md5 === md5) {
      this.spinner.hide();
      this.loading = false;
      return;
    }

    this.md5 = md5;
    this.imagePath = data.path;

    this.clear();
    this.pages = this.groupByPage(data.files);

    this.loadFramesByPageID(this.currentPageID);

    this.addThumbnails(this.pages, this.imagePath);

    this.pagination = new Pagination(this.currentFrames);

    this.pagination.$element.addEventListener("thumb-clicked", (event) => {
      this.drawFrame(event.detail.id);
    });

    this.pagination.updatePages(this.currentFrames);
    this.drawFrame(this.currentFrameID);
  }

  getFrameByID(id) {
    return this.currentFrames.find((frame) => frame.getID() === id);
  }

  drawFrame(id) {
    const currentFrame = this.getFrameByID(id);

    this.bindFrameEvents(currentFrame);

    currentFrame.show().then(() => {
      if (
        this.previousFrame &&
        this.previousFrame.getID() !== currentFrame.getID()
      ) {
        this.previousFrame.hide();
      }
      this.previousFrame = currentFrame;
    });
  }

  loadFramesByPageID(pageID) {
    this.clear();

    let promises = [];

    const frames = this.pages[pageID][1];

    if (frames.length > 1) {
    } else {
    }

    this.startLoading();

    const reversedFrames = [...frames].reverse();

    reversedFrames.forEach((data, id) => {
      const frame = new Frame({ id, ...data }, this.imagePath);

      this.currentFrames.push(frame);
      promises.push(frame.load());
    });

    Promise.all(promises).then(this.loadFrames.bind(this));
  }

  clear() {
    this.currentFrames.forEach((frame) => frame.remove());
    this.currentFrames = [];
  }

  getTotalHeight(results) {
    let height = 0;

    results.forEach((frame) => {
      let rect = frame.image.getBoundingClientRect();
      height += rect.height;
    });

    return height;
  }

  loadFrames(results) {
    this.loading = false;
    this.spinner.hide();
    this.stopLoading();

    results.forEach((frame, _index) => {
      this.$canvas.appendChild(frame.image);
    });
  }
}
