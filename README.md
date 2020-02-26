# News Flash
News Flash is a Mongo News Scraper utilizing cheerio to scrape National Public Radio's World News (https://www.npr.org/sections/world/) page. 

## Functionality
News Flash scrapes the NPR 

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
