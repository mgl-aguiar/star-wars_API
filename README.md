# Summary

This is a Star Wars API to search for characters from specific movies or to search for planets according to climate type.
The data is fetched from the [SWAPI](https://swapi.py4e.com/) Star Wars API.

# Setup

This API uses Express for the server and Axios to fetch data.

To install modules run:

    npm install

And to run server use:

    npm run start

Or, for development purposes:

    npm run dev

# Endpoints

The code for the endpoints are organized in seperate router files, check out the router folder for their specific implementation.

## Characters endpoint:

To fetch characters from a movie, search for a word or more from the movie title using the <i>?search=</i> query:

Example: fetching character from "A New Hope"

    localhost:4000/characters?search=new%20hope

The results are display 30 at a time. To access the next page, use the <i>?page=</i> query:

Example: fetching page 2 of characters from "Attack of the Clones"

    localhost:4000/characters?search=clones&page=2

### Filtering and sorting:

The result of the search can be filtered by gender and sorted by height or age.

Filter by gender using the <i>?gender=</i> query. The input can be "male" or "female".

Example: fetching all female character from "The Empire Strikes Back"

    localhost:4000/characters?search=empire&gender=female

Sorting can be done using the <i>?sortByAge=</i> and the <i>?sortByHeight=</i> queries.

Input can be either 'asc' for ascending order, or 'desc' for descending order.

Example: fetching characters from "Return of the Jedi" and sorting by ascending height

    localhost:4000/characters?search=return&sortByHeight=asc

## Planets endpoint:

The planets endpoint will fetch all planets from the database 10 at a time:

    localhost:4000/planets

To go to the next page, use the <i>?page=</i> query.

Example:

    localhost:4000/planets?page=2

### Search for planet based on climate:

To search for planets with a specific climate type, use the <i>?climate=</i> query.

Example: fetching all planets that contain the "temperate" climate type.

    localhost:4000/planets?climate=temperate

When searching for a specific climate, the resulting planet object will also contain an array with all dark-haired characters that live on that planet.
