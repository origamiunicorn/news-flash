# News Flash
News Flash is a Mongo News Scraper utilizing cheerio to scrape National Public Radio's World News (https://www.npr.org/sections/world/) page. Pages are dynamically rendered using express-handlebars, and the mongo database is managed using mongoose (which helps with populating one collection into another on the "Saved Articles" page).

## Functionality
News Flash scrapes the NPR World News with cheerio when the "Scrape New Articles" button is selected. Once the scraping is complete, the page will be reloaded, adding new articles to the bottom of the page. Any article can be "saved" by selecting the "Save Article" button. That article is then checked against the save article database to see if there's already an article saved with the same title. If no article is found, then the article is saved to the database and will display when navigating to the "Saved Articles" page.

Selecting "Clear Articles" on either the "Home" or "Saved Articles" page will clear all articles from the page *and* the associated database.

When a user navigates to the "Saved Articles" page, if no articles have been saved, they'll see a message stating there are no saved articles. If articles have been saved, those articles will be displayed in descending order. Each article has two buttons: one for adding notes to the article, and one for deleting the article from the "Saved Articles" page.

Selecting the "Add/Review Notes" button populates a modal with any notes associated with that article. These notes are populated to that article from another collection based on their id's being saved to an object in a given article found on the saved articles collection. After inputting a note into the textarea field, a user must select "Save Note" in order to successfully save that note to the notes collection. The note is then populated into the notes modal using mongoose. Articles may have as many or few notes as users wish to make. Individual notes can be deleted by selecting the "X" located within the note's div.

When "Delete" is selected on an article on the "Saved Articles" page, that article is deleted from the saved articles collection and the page is reloaded. Again, to delete all saved articles at once, one may select the "Clear Articles" button in the top navigation menu.

## Challenges
Handlebars information object passing can be tricky, and I was running into difficulties related to passing information from the database based on what was pulled out of the database. Eventually the solution was to use context to pass the initial objects into the database, which allowed for them to be found by ID (findById). I'd located the issue as being new for several users at the time where I ran into it (02/23/20) from within the last week.

## Featured Technologies
* Materialize (CSS Library+)
* MongoDG (Mongoose)

## NPM Packages Used
* Axios
* Cheerio
* Express
* Express-Handlebars
* Mongoose

## Languages Used
* CSS3
* HTML5
* JavaScript (jQuery)

## Other Resources
* Unsplash.com () for Parallax Image background.

## Future Goals
* Have the scraper check for matching article titles, and only adds an article with no match found.