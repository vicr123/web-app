import saveNote from './saveNote';
import createNote from './createNote';
import { endCreateNote } from './../../actions/note';
import Poplet from '../../';

export default async (boardId, noteId, position) => {
  const store = Poplet.store;
  const state = store.getState();
  const note = noteId ? state.notesByBoard[boardId][noteId] : state.notesByBoard[boardId]['-1'];

  if (!note) {
    throw new Error('Attempt to move invalid note');
  }

  const { x, y } = position;
  note.options = note.options || {};
  note.options.position = { x, y };

  if (!position) {
    throw new Error('\'moveNote\' requires \'position\' argument to be a valid object with keys (x,y)');
  }
  if (!Number.isInteger(x) || !Number.isInteger(y)) {
    throw new Error('One or more position values are not valid integers');
  }
  if (note.id) {
    await saveNote(boardId, note);
    return note;
  } else {
    store.dispatch(endCreateNote(boardId));
    await createNote(boardId, note);
  }
};
