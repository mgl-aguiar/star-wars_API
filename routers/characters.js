const { Router } = require("express");
const router = new Router();
const axios = require("axios");

const { apiUrl } = require("../constants");

router.get("/", async (req, res, next) => {
  // 'search' query is used to find the characters of a specific film
  // 'gender' query is used fo filter by 'male' or 'female'
  // 'sortByAge' or 'sortByHeight' queries are used to sort based on 'asc' or 'desc' input
  // 'page' query is used in the pagination function
  const { search, gender, sortByAge, sortByHeight, page } = req.query;

  try {
    // used let so variable can be changed depending on which queries are used
    let characterObjects = null;

    if (search) {
      const film = await axios.get(`${apiUrl}/films/?search=${search}`);

      // validation in case search term is not included in any movie:
      if (film.data.count === 0) {
        return res
          .status(400)
          .send("Could not find movie with specified search term.");
      }

      // had to access 0 index in the results array to be able to map over character urls on line 32
      const charactersUrls = film.data.results[0].characters;

      // making a request for each character url for specified film:
      const characterListRequests = charactersUrls.map((eachCharacterUrl) =>
        axios.get(eachCharacterUrl)
      );

      // assigning previous requests to new const once they are ready:
      const characterObjectsData = await Promise.all(characterListRequests);

      // assigning characters data to previously declared variable
      characterObjects = characterObjectsData.map(
        (eachCharacterData) => eachCharacterData.data
      );
    } else {
      return res.status(400).send("Please specify movie search term");
    }

    // binary gender filter:
    if (gender === "male" || gender === "female") {
      characterObjects = characterObjects.filter(
        (eachCharacterObject) => eachCharacterObject.gender === gender
      );
    } else if (gender) {
      return res
        .status(400)
        .send("Could not filter by gender. Specify 'male' or 'female'.");
    }

    // sorting by ascending or descending height:
    if (sortByHeight && sortByHeight === "asc") {
      characterObjects.sort((a, b) => a.height - b.height);
    } else if (sortByHeight && sortByHeight === "desc") {
      characterObjects.sort((a, b) => b.height - a.height);
    } else if (sortByHeight) {
      return res
        .status(400)
        .send(
          "Please specify 'asc' or 'desc' to sort by ascending or descending height."
        );
    }

    // sorting by ascending or descending age:
    if (sortByAge && sortByAge === "asc") {
      characterObjects.sort(
        //had to use parseFloat since birth_year is a string with 'BBY' after the number
        (a, b) => parseFloat(a.birth_year) - parseFloat(b.birth_year)
      );
    } else if (sortByAge && sortByAge === "desc") {
      characterObjects.sort(
        (a, b) => parseFloat(b.birth_year) - parseFloat(a.birth_year)
      );
    } else if (sortByAge) {
      return res
        .status(400)
        .send(
          "Please specify 'asc' or 'desc' to sort by ascending or descending age."
        );
    }

    // response sent according to pagination function:
    res.send(paginate(characterObjects, page));
  } catch (error) {
    next(error);
  }
});

// pagination function to limit 30 entries per page:
function paginate(dataToSend, page) {
  const currentPage = !page ? 1 : page;
  const limit = 30;

  const startIndex = (currentPage - 1) * limit;
  const endIndex = currentPage * limit;

  const paginatedResults = dataToSend.slice(startIndex, endIndex);

  return paginatedResults;
}

module.exports = router;
