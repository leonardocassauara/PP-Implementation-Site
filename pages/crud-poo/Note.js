class Note {
  #title;
  #description;
  #tag;

  constructor(title, description, tag) {
    this.#title = title;
    this.#description = description;
    this.#tag = tag;
  }

  getTitle() {
    return this.#title;
  }

  getDescription() {
    return this.#description;
  }

  getTag() {
    return this.#tag;
  }

  setTitle(title) {
    this.#title = title;
  }

  setDescription(description) {
    this.#description = description;
  }

  setTag(tag) {
    this.#tag = tag;
  }
}
