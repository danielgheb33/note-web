import axios from 'axios';

/**
 * @todo make sure than all the API urls correspond to the urls on the server side
 */

/**
 * @todo currently, Arjun's email is hardcoded when requesting the filesystem (line 135)
 * after we get the file creation/saving working we can swap in out for "userID".
 */

/////////////////////////////////////////////////These functions are all POST Requests/////////////

/**
 * This callback handles the list of note objects returned by getNotesData.
 *
 * @callback getNotesDataCallback
 * @param {Object[]} data a list of note objects.
 */

/**
 * This requests and handles all the notes data for a user.
 *
 * @param {string} userID the id of the user whose note data we are requesting
 * @param {getNotesDataCallback} callback handles the list of note objects returned by getNotesData
 */
export function getNotesData(userID, callback) {

    const toSend = {
        userID: userID,
    };

    let config = {
        headers: {
            "Content-Type": "application/json",
            'Access-Control-Allow-Origin': '*',
        }
    };

    axios.post(
        "http://localhost:4567/notes-data",
        toSend,
        config
    )
        .then(response => {
            /**
             * The data should be a list of note objects. Make sure the callback is expecting this.
             *
             * For example:
             * [{
             *      userID: "user@email.com",
             *      path: "/path/to/noteName",
             *      name: "noteName",
             *      tags: ["tag1","tag2",...],
             *      description: "This is an example note"
             *      links: ["path/to/another/note",...]
             *      content: "this is the full content of the "
             * }, ...]
             */
            console.log(response.data);
            callback(response.data);
        })
        .catch(error => {
            console.log(error);
        });
}

/**
 * This callback handles note data.
 * @callback getNoteDatumCallback
 * @param {Object} data an object containing the data of a note.
 */

/**
 *
 * @param {string} userID the id of the user associated with the note we are requesting.
 * @param {string} path the path to the note in the user directory.
 * @param {getNoteDatumCallback} callback the callback that handles the returned note data.
 */
export function getNoteDatum(userID, path, callback) {
    console.log(path);
    const toSend = {
        userID: userID,
        path: path
    };

    let config = {
        headers: {
            "Content-Type": "application/json",
            'Access-Control-Allow-Origin': '*',
        }
    };

    axios.post(
        "http://localhost:4567/note-datum",
        toSend,
        config
    )
        .then(response => {
            /**
             * The data should be a single note object. Make sure the callback is expecting this.
             *
             * For example:
             * {
             *      userID: "user@email.com",
             *      path: "/path/to/noteName",
             *      name: "noteName",
             *      tags: ["tag1","tag2",...],
             *      description: "This is an example note"
             *      links: ["path/to/another/note",...]
             *      content: "this is the full content of the "
             * }
             */
            console.log(response.data);
            callback(response.data);
        })
        .catch(error => {
            console.log(error);
        });
}

/**
 * This callback handles a nested set of objects representing the current user filesystem.
 *
 * @callback getFileSystemCallback
 * @param {Object} data a set of nested objects.
 */

/**
 * Sends a fetch to the server for a user's data and then handles that data.
 *
 * @param {string} userID the id of the user whose data we are retrieving.
 * @param {getFileSystemCallback} callback a callback that handles the filesystem data
 */
export function getFileSystem(userID, callback) {
    const toSend = {
        userID: userID
    };

    let config = {
        headers: {
            "Content-Type": "application/json",
            'Access-Control-Allow-Origin': '*',
        }
    };

    axios.post(
        "http://localhost:4567/filesystem",
        toSend,
        config
    )
        .then(response => {
            /**
             * The data should be a directory object (with a property "children" that contains more objects). Make sure the callback is expecting this.
             *
             * For example:
             * {
             *      path: "",
             *      name: "directoryName",
             *      type: "Folder",
             *      children: [{...},{...},{...},...]
             * }
             */
            // console.log(response.data);
            callback(response.data);
        })
        .catch(error => {
            console.log(error);
        });
}

/////////////////////////////////////////////////These are all the POST requests///////////////////

/**
 * This callback handles the return message/data (if any) when a note has been saved (or failed to save).
 *
 * @callback postSavedNoteCallback
 * @param {string} data the return data (probably a message indicating success/failure)
 */

/**
 * Sends a post request that saves all the data for a note
 *
 * @param {string} userID the userID of the note being saved
 * @param {Object} noteDatum the note object to be saved
 * @param {postSavedNoteCallback} handleNoteSave the callback that handles the return data from saving a note
 */
export function postSavedNote(userID, noteDatum, callback) {
    console.log("postSavedNote sent: ", noteDatum);
    const toSend = {
        userID: userID,
        noteDatum: noteDatum
    };

    let config = {
        headers: {
            "Content-Type": "application/json",
            'Access-Control-Allow-Origin': '*',
        }
    };

    axios.post(
        "http://localhost:4567/saved-note",
        toSend,
        config
    )
        .then(response => {
            /**
             * The data should just be a string with the status of the post request (success/failure). Make sure the callback is expecting this.
             */
            console.log(response.data);
            callback(response.data);
        })
        .catch(error => {
            console.log(error);
        });
}


/**
 * Sends a post request that creates a folder in the backend when one is created in frontend.
 *
 * @param {string} path to folder from the user's root directory
 * @param {getFileSystemCallback} callback a callback that handles the filesystem data
 */




