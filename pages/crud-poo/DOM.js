class DOM extends NoteDataOperations {
  #newDialog;
  #editDialog;
  #notesContainer;
  #newTitle;
  #newDescription;
  #newTag;
  #newSelectTag;
  #editTitle;
  #editDescription;
  #editTag;
  #editSelectTag;
  #localDB;

  constructor(localDB) {
    super();
    this.#localDB = localDB;
    this.#newDialog = document.getElementById("new-dialog-id");
    this.#newTitle = document.getElementById("new-title");
    this.#newDescription = document.getElementById("new-description");
    this.#newTag = document.getElementById("new-tag");
    this.#newSelectTag = document.getElementById("new-select-tag");
    this.#editDialog = document.getElementById("edit-dialog-id");
    this.#editTitle = document.getElementById("edit-title");
    this.#editDescription = document.getElementById("edit-description");
    this.#editTag = document.getElementById("edit-tag");
    this.#editSelectTag = document.getElementById("edit-select-tag");
    this.#notesContainer = document.getElementsByClassName(
      "banner__notes-wrapper"
    )[0];
  }

  create(
    title = "",
    description = "",
    tagText = "",
    tagColor = "",
    addDB = true,
    key = ""
  ) {
    if (title == "") title = this.#newTitle.value;
    if (description == "") description = this.#newDescription.value;
    if (tagText == "") tagText = this.#newTag.value;
    if (tagColor == "") tagColor = this.#newSelectTag.value;
    const newTag = new Tag(tagText, tagColor);
    const newNote = new Note(title, description, newTag);

    const noteWrapper = document.createElement("div");
    noteWrapper.classList.add("note");
    noteWrapper.addEventListener("click", this.openEditDialog.bind(this));

    const noteTitleTagWrapper = document.createElement("div");
    noteTitleTagWrapper.classList.add("note__title-tag-wrapper");

    const noteTitle = document.createElement("h3");
    noteTitle.classList.add("note__title");
    noteTitle.innerText = title;

    const noteDescription = document.createElement("p");
    noteDescription.classList.add("note__description");
    noteDescription.innerText = description;

    const noteTag = document.createElement("p");
    noteTag.innerText = tagText;

    if (tagColor == "amarelo") noteTag.classList.add("note__tag--yellow");
    else if (tagColor == "vermelho") noteTag.classList.add("note__tag--red");
    else if (tagColor == "verde") noteTag.classList.add("note__tag--green");
    else if (tagColor == "azul") noteTag.classList.add("note__tag--blue");

    noteTitleTagWrapper.appendChild(noteTitle);
    noteTitleTagWrapper.appendChild(noteTag);
    noteWrapper.appendChild(noteTitleTagWrapper);
    noteWrapper.appendChild(noteDescription);
    this.#notesContainer.appendChild(noteWrapper);

    if (addDB) {
      const randomId = generateRandomId();
      noteWrapper.dataset.id = randomId;
      noteTitle.dataset.id = randomId;
      noteDescription.dataset.id = randomId;
      noteTag.dataset.id = randomId;
      noteTitleTagWrapper.dataset.id = randomId;
      this.#localDB.create(newNote, randomId);
    } else {
      noteWrapper.dataset.id = key;
      noteTitle.dataset.id = key;
      noteDescription.dataset.id = key;
      noteTag.dataset.id = key;
      noteTitleTagWrapper.dataset.id = key;
    }

    this.closeNewDialog();
  }

  read() {
    const notesInDB = this.#localDB.read();
    const notesInDOM = document.getElementsByClassName("note");

    if (notesInDOM.length)
      Array.from(notesInDOM).forEach((note) => {
        note.remove();
      });

    Object.entries(notesInDB).forEach(([key, value]) => {
      let obj = JSON.parse(value);
      this.create(
        obj.title,
        obj.description,
        obj.tag.title,
        obj.tag.color,
        false,
        key
      );
    });
  }

  update() {
    const title = this.#editTitle.value;
    const description = this.#editDescription.value;
    const tagText = this.#editTag.value;
    const tagColor = this.#editSelectTag.value;
    const noteId = this.#editDialog.dataset.id;

    this.#localDB.update(
      new Note(title, description, new Tag(tagText, tagColor)),
      noteId
    );
    this.closeEditDialog();
    this.read();
  }

  delete() {
    const noteId = this.#editDialog.dataset.id;
    this.#localDB.delete(noteId);
    this.closeEditDialog();
    this.read();
  }

  openNewDialog() {
    this.#newDialog.showModal();
  }

  closeNewDialog() {
    this.#newDialog.close();
    this.#newTitle.value = "";
    this.#newDescription.value = "";
    this.#newTag.value = "";
    this.#newSelectTag.value = "azul";
  }

  openEditDialog(event) {
    this.#editDialog.showModal();
    const note = JSON.parse(this.#localDB.getNote(event.target.dataset.id));
    this.#editTitle.value = note.title;
    this.#editDescription.value = note.description;
    this.#editTag.value = note.tag.title;
    this.#editSelectTag.value = note.tag.color;
    this.#editDialog.dataset.id = event.target.dataset.id;
  }

  closeEditDialog() {
    this.#editDialog.close();
    this.#editTitle.value = "";
    this.#editDescription.value = "";
    this.#editTag.value = "";
    this.#editSelectTag.value = "azul";
  }
}
