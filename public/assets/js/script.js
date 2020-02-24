$(document).ready(function () {
    $('.parallax').parallax();
    $('.modal').modal();
    $('.sidenav').sidenav();
    $(document).on("click", "#scrape", scrapeArticles);
    $(document).on("click", "#clear", clearArticles);
    $(document).on("click", "#clearSaved", clearSaved);
    $(document).on("click", "#save", saveArticle);
    $(document).on("click", "#delete", deleteArticle);
    $(document).on("click", "#note", makeNote);
    $(document).on("click", "#savenote", saveNote);
    $(document).on("click", ".deleteNote", deleteNote);
});

// Whenever someone clicks a #scrape tag
const scrapeArticles = function () {
    $.ajax(
        {
            method: "GET",
            url: "/scrape"
        }
    ).then(function () {
        window.location.reload();
    });
};

const clearArticles = function () {
    $.ajax(
        {
            method: "DELETE",
            url: "/clear"
        }
    ).then(function () {
        window.location.reload();
    });
};

const clearSaved = function () {
    $.ajax(
        {
            method: "DELETE",
            url: "/clearsav"
        }
    ).then(function () {
        window.location.reload();
    });
};

const saveArticle = function () {
    const id = $(this).attr("data-id");
    $.ajax(
        {
            method: "POST",
            url: "/api/save:" + id
        }
    ).then(function () {
        window.location.reload();
    });
};

const deleteArticle = function () {
    const id = $(this).attr("data-id");
    $.ajax(
        {
            method: "DELETE",
            url: "/api/delete:" + id
        }
    ).then(function () {
        window.location.reload();
    });
};

const makeNote = function () {
    const thisId = $(this).attr("data-id");
    console.log("this is thisId", thisId);
    $("#savenote").attr("data-id", thisId);

    // Now make an ajax call for the Article
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
        // With that done, add the note information to the page
        .then(function (data) {
            console.log("this is data in the makeNote function", data);
            $("#articleTitle").text(`Notes for "${data.title}."`);
            for (let i = 0; i < data.note.length; i++) {
                $("#notesContainer").append(`<p>${data.note[i].body} <i data-id="${data.note[i]._id}" data-parent-id="${data._id}"
                class="small material-icons red-text text-darken-4 right deleteNote"
                alt="Delete this note.">close</i></p>`);
            }
        });
};

// When you click the savenote button
const saveNote = function () {
    // Grab the id associated with the article from the submit button
    const thisId = $(this).attr("data-id");

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            // Value taken from note textarea
            body: $("#bodyinput").val()
        }
    })
        // With that done
        .then(function (data) {
            // Log the response
            console.log(data);
            // Empty the notes section
            $("#notes").empty();
        });

    // Also, remove the values entered in the input and textarea for note entry
    $("#bodyinput").val("");
};

const deleteNote = function (event) {
    // event.stopPropagation();
    // event.stopImmediatePropagation();

    const id = $(this).attr("data-id");
    const parent = $(this).attr("data-parent-id");
    $.ajax(
        {
            method: "DELETE",
            url: "/delete/note:" + id + "/:" + parent
        }
    ).then(function () {
        window.location.reload();
    });
};