const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");

const PORT = 3000;

// Initialize Express
const app = express();

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/newsFlashDB", { useNewUrlParser: true, useUnifiedTopology: true });

// Handlebars
app.engine(
    "handlebars",
    exphbs({
        defaultLayout: "main"
    })
);
app.set("view engine", "handlebars");

// Routes

require("./routes/htmlRoutes")(app);

require("./routes/apiRoutes")(app);

app.listen(PORT, function () {
    console.log(
        "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
        PORT,
        PORT
    );
});


module.exports = app;