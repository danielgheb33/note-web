
export class Note {

    /**
     * This creates a new "empty" note object. 
     * 
     * @param {string} userID the user id of the user who created the note
     * @param {string} path the path to the note in the directory
     * @param {string} name the name of the note
     */
    constructor(userID, path, name) {
        this.userID = userID;
        this.path = path;
        this.name = name;
        this.tags = [];
        this.description = "";
        this.links = [];
        this.content = "";
    }

    /**
     * This creates a note with all arguments populated
     * 
     * @param {string} userID the user id of the user who created the note
     * @param {string} path the file path of the note
     * @param {string} name the name of the note
     * @param {string[]} tags a list of tags associated with the note
     * @param {string} description the meta description of the note
     * @param {string[]} links a local links within the note
     * @param {string} content the full content of the note
     */
    constructor(userID, path, name, tags, description, links, content) {
        this.userID = userID;
        this.path = path;
        this.name = name;
        this.tags = tags;
        this.description = description;
        this.links = links;
        this.content = content;
    }

}