$(document).ready(function () {
    $('.parallax').parallax();
    $('.sidenav').sidenav();
    $('.modal').modal();
    $(document).on("click", "#scrape", scrapeArticles);
    $(document).on("click", "#clear", clearArticles);
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
