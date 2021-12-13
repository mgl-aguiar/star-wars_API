const { Router } = require("express");
const router = new Router();
const axios = require("axios");

const { apiUrl } = require("../constants");

// get list of planets
router.get("/", async (req, res, next) => {
  const { climate } = req.query;

  try {
    const planets = await axios.get(`${apiUrl}/planets`);
    const planetsObjects = planets.data.results;

    if (climate) {
      const filteredPlanetObjects = planetsObjects.filter(
        (eachPlanet) => eachPlanet.climate === climate
      );

      const filteredPlanetList = filteredPlanetObjects.map(
        (eachPlanet) => eachPlanet.name
      );

      res.send(filteredPlanetList);
    } else {
      const allPlanetsList = planetsObjects.map(
        (eachPlanetObject) => eachPlanetObject.name
      );

      res.send(allPlanetsList);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
