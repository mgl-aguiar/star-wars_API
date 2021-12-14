const { Router } = require("express");
const router = new Router();
const axios = require("axios");

const { apiUrl } = require("../constants");

// fetch planets by climate search term
router.get("/", async (req, res, next) => {
  const { climate, page } = req.query;

  try {
    const planets = await axios.get(`${apiUrl}/planets`);
    let planetsArray = planets.data.results;

    if (climate) {
      planetsArray = planetsArray.filter((eachPlanet) =>
        eachPlanet.climate.split(", ").includes(climate)
      );
    } else {
      const allPlanets = await axios.get(
        `${apiUrl}/planets/?page=${!page ? 1 : page}`
      );

      planetsArray = allPlanets.data.results;
    }

    res.send(planetsArray);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
