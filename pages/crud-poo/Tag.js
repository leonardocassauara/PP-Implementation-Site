class Tag {
  #title;
  #color;

  constructor(title, color) {
    this.#title = title;
    this.#color = color;
  }

  getTitle() {
    return this.#title;
  }

  getColor() {
    return this.#color;
  }

  setTitle(title) {
    this.#title = title;
  }

  setColor(color) {
    this.#color = color;
  }
}
