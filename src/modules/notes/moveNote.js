import { createNote, saveNote, updateGroup, isNoteInGroup, determineSize } from './../';
import { endCreateNote } from './../../actions/note';
import Poplet from '../../';

export default async (boardId, noteId, position) => {
  const store = Poplet.store;
  const state = store.getState();
  const notes = state.notesByBoard[boardId];
  const note = noteId ? notes[noteId] : notes[boardId]['-1'];

  if (!note) {
    throw new Error('Attempt to move invalid note');
  }

  if (!position) {
    throw new Error('\'moveNote\' requires \'position\' argument to be a valid object with keys (x,y)');
  }

  const { x, y } = position;
  if (!Number.isInteger(x) || !Number.isInteger(y)) {
    throw new Error('One or more position values are not valid integers');
  }

  note.position = { x, y };

  const groupId = isNoteInGroup(note.id);
  if (groupId) {
    const group = state.groupsByBoard[boardId][groupId];
    group.size = determineSize(group);
    updateGroup(boardId, group);
  }

  if (note.id) {
    console.log(note.position)
    saveNote(boardId, note);
    return note;
  } else {
    store.dispatch(endCreateNote(boardId));
    createNote(boardId, note);
  }
};