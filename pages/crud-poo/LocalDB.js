class LocalDB extends NoteDataOperations {
  constructor() {
    super();
  }

  create(Note, key) {
    const publicNote = {
      title: Note.getTitle(),
      description: Note.getDescription(),
      tag: {
        title: Note.getTag().getTitle(),
        color: Note.getTag().getColor(),
      },
    };
    localStorage.setItem(key, JSON.stringify(publicNote));
  }

  read() {
    let allNotes = {};
    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
      let value = localStorage.getItem(key);
      allNotes[key] = value;
    }
    return allNotes; // * Estrutura da leitura: {0: {nota}, 1: {nota} }
  }

  update(Note, key) {
    const publicNote = {
      title: Note.getTitle(),
      description: Note.getDescription(),
      tag: {
        title: Note.getTag().getTitle(),
        color: Note.getTag().getColor(),
      },
    };
    localStorage.setItem(key, JSON.stringify(publicNote));
  }

  delete(key) {
    localStorage.removeItem(key);
  }

  getNote(key) {
    return localStorage.getItem(key);
  }
}
