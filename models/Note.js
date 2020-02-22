const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Using the Schema constructor, create a new NoteSchema
const NoteSchema = new Schema({
    // create a title string
    title: String,
    // create a body string
    body: String
});

// Create a model from the above schema using mongoose's model method
const Note = mongoose.model("Note", NoteSchema);

// Export the Note model
module.exports = Note;