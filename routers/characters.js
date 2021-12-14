const { Router } = require("express");
const router = new Router();
const axios = require("axios");

const { apiUrl } = require("../constants");

router.get("/", async (req, res, next) => {
  const { search, gender, sort, page } = req.query;

  try {
    let characterObjects = null;

    if (search) {
      const film = await axios.get(`${apiUrl}/films/?search=${search}`);
      const charactersUrls = film.data.results[0].characters;

      const characterListRequests = charactersUrls.map((eachCharacterUrl) =>
        axios.get(eachCharacterUrl)
      );

      const characterObjectsData = await Promise.all(characterListRequests);

      characterObjects = characterObjectsData.map(
        (eachCharacterData) => eachCharacterData.data
      );
    } else {
      const allCharactersData = await axios.get(
        `${apiUrl}/people/?page=${!page ? 1 : page}`
      );

      characterObjects = allCharactersData.data.results;
    }

    if (gender) {
      characterObjects = characterObjects.filter(
        (eachCharacterObject) => eachCharacterObject.gender === gender
      );
    }

    if (sort && sort === "heightAsc") {
      characterObjects.sort((a, b) => a.height - b.height);
    } else if (sort && sort === "heightDesc") {
      characterObjects.sort((a, b) => b.height - a.height);
    }

    if (sort && sort === "ageAsc") {
      characterObjects.sort(
        (a, b) => parseFloat(a.birth_year) - parseFloat(b.birth_year)
      );
    } else if (sort && sort === "ageDesc") {
      characterObjects.sort(
        (a, b) => parseFloat(b.birth_year) - parseFloat(a.birth_year)
      );
    }

    res.send(characterObjects);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
