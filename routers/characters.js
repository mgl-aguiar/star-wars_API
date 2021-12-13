const { Router } = require("express");
const router = new Router();
const axios = require("axios");

const { apiUrl } = require("../constants");

// test endpoint, get all characters
router.get("/all", async (req, res, next) => {
  try {
    const characters = await axios.get(`${apiUrl}/people`);
    res.send(characters.data);
  } catch (error) {
    next(error);
  }
});

// get list of characters from a specified film
router.get("/", async (req, res, next) => {
  const { search, gender } = req.query;

  try {
    if (search) {
      const film = await axios.get(`${apiUrl}/films/?search=${search}`);
      const charactersUrls = film.data.results[0].characters;

      const characterListRequests = charactersUrls.map((eachCharacterUrl) =>
        axios.get(eachCharacterUrl)
      );

      const characterObjects = await Promise.all(characterListRequests);

      if (gender) {
        const filteredCharacterObjects = characterObjects.filter(
          (eachCharacterObject) => eachCharacterObject.data.gender === gender
        );

        const filteredFilmCharactersList = filteredCharacterObjects.map(
          (eachCharacter) => eachCharacter.data.name
        );

        res.send(filteredFilmCharactersList);
      } else {
        const filmCharactersList = characterObjects.map(
          (eachCharacter) => eachCharacter.data.name
        );

        res.send(filmCharactersList);
      }
    } else {
      const allCharactersData = await axios.get(`${apiUrl}/people`);

      const allCharactersObjects = allCharactersData.data.results;

      const allCharactersList = allCharactersObjects.map(
        (eachCharacterObject) => eachCharacterObject.name
      );

      res.send(allCharactersList);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
