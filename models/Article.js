const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Using the Schema constructor, create a new ArticleSchema 
const ArticleSchema = new Schema({
    // require a title string
    title: {
        type: String,
        required: true
    },
    // require a link string
    link: {
        type: String,
        required: true
    },
    // require a photo string
    photo: {
        type: String,
        required: true
    },
    // create a note object
    // ref links to the Note model, so notes related to an Article can be populated later
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});

// Create a model from the above schema using mongoose's model method
const Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;