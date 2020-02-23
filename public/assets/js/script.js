$(document).ready(function () {
    $('.parallax').parallax();
    $('.sidenav').sidenav();
    $('.modal').modal();
    $(document).on("click", "#scrape", scrapeArticles);
});

// Whenever someone clicks a #scrape tag
const scrapeArticles = function () {
    $.ajax({
        method: "GET",
        url: "/scrape"
    })
        .then(function () {
            window.location.reload();
        });
};
// const scrape = $(document).on("click", "#scrape", function () { });
// $(document).on("click", "#scrape", function () {

//     // Now make an ajax call for the Articles
//     $.ajax({
//         method: "GET",
//         url: "/scrape"
//     })
//         // With that done, add the note information to the page
//         .then(function (data) {
//             console.log(data);
//         });
// });