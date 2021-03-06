/* global $ store api*/
'use strict';

const noteful = (function () {

  function render() {

    const notesList = generateNotesList(store.notes, store.currentNote);
    $('.js-notes-list').html(notesList);

    const editForm = $('.js-note-edit-form');
    editForm.find('.js-note-title-entry').val(store.currentNote.title);
    editForm.find('.js-note-content-entry').val(store.currentNote.content);
  }

  /**
   * GENERATE HTML FUNCTIONS
   */
  function generateNotesList(list, currentNote) {
    const listItems = list.map(item => `
    <li data-id="${item.id}" class="js-note-element ${currentNote.id === item.id ? 'active' : ''}">
      <a href="#" class="name js-note-show-link">${item.title}</a>
    </li>`);
    return listItems.join('');
  }

  /**
   * HELPERS
   */
  function getNoteIdFromElement(item) {
    const id = $(item).closest('.js-note-element').data('id');
    return id;
  }

  /**
   * EVENT LISTENERS AND HANDLERS
   */
  function handleNoteItemClick() {
    $('.js-notes-list').on('click', '.js-note-show-link', event => {
      event.preventDefault();

      const noteId = getNoteIdFromElement(event.currentTarget);

      api.details(noteId, response => {
        store.currentNote = response;
        render();
      });

    });
  }

  function handleNoteSearchSubmit() {
    $('.js-notes-search-form').on('submit', event => {
      event.preventDefault();

      const searchTerm = $('.js-note-search-entry').val();
      store.currentSearchTerm = searchTerm ? {
        searchTerm
      } : {};

      api.search(store.currentSearchTerm, response => {
        store.notes = response;
        render();
      });
    });
  }

  // event listener for handling submissions
  function handleNoteFormSubmit() {
    $('.js-note-edit-form').on('submit', function (event) {
      event.preventDefault();

      const editForm = $(event.currentTarget);

      const noteObj = {
        title: editForm.find('.js-note-title-entry').val(),
        content: editForm.find('.js-note-content-entry').val()
      };

      noteObj.id = store.currentNote.id;
      // console.log(noteObj);
      

      api.update(noteObj.id, noteObj, updateResponse => {
        // console.log(store);
        // title in store to be equal title in database
        // store.currentNote; noteObj.title
        console.log(store.notes[0]);
        
        // console.log(noteObj.id);
        // console.log(store.currentNote.title);
        // console.log(noteObj.title);
        
        // console.log(noteObj.id);
        
        const test = store.notes.find((item) => item.id === noteObj.id); // return entire object of an id ::: search (noteObj.id)
        console.log(test.title);
        
        // objID.title = noteObj.title
        // updates 

        // updates title
        test.title = noteObj.title;

        // updates content
        store.currentNote = updateResponse;

        render();
      });
      // location.reload();
    });
  }

  function bindEventListeners() {
    handleNoteItemClick();
    handleNoteSearchSubmit();
    handleNoteFormSubmit();
  }

  // This object contains the only exposed methods from this module:
  return {
    render: render,
    bindEventListeners: bindEventListeners,
  };

}());