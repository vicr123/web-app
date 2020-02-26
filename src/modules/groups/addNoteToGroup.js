import Poplet from '../../';
import { updateGroup, saveNote, determineSize } from './../';

export default (boardId, groupId, noteId) => {
  const store = Poplet.store;
  const state = store.getState();
  const group = state.groupsByBoard[boardId][groupId];
  if (group && !group.items.includes(noteId)) {
    const note = state.notesByBoard[boardId][noteId];
    note.position = { x: 0, y: 0 };
    group.size = determineSize(group);
    group.items.push(noteId);
    updateGroup(boardId, group);
    saveNote(boardId, note);
  }
};
