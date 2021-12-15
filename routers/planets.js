const { Router } = require("express");
const router = new Router();
const axios = require("axios");

const { apiUrl } = require("../constants");

router.get("/", async (req, res, next) => {
  const { climate, page } = req.query;

  try {
    const allPlanets = await axios.get(
      `${apiUrl}/planets/?page=${!page ? 1 : page}`
    );

    let planetsArray = allPlanets.data.results;

    if (climate) {
      // filtering allPlanets array according to climate keyword input:
      const filteredPlanetsArray = planetsArray
        .filter((eachPlanet) =>
          eachPlanet.climate.split(", ").includes(climate)
        )

        // mapping over filteredPlanetsArray to request each residents url:
        .map(async (eachPlanet) => {
          const residentsUrlsRequests = eachPlanet.residents.map(
            (eachResidentUrl) => axios.get(eachResidentUrl)
          );
          // defining a resident list after all requests are done:
          const residentList = await Promise.all(residentsUrlsRequests);

          // filtering dark haired residents from the resident list:
          const darkHairedResidents = residentList
            .map((eachResident) => eachResident.data)
            .filter(
              (eachResident) =>
                eachResident.hair_color === "black" ||
                eachResident.hair_color === "brown"
            );

          // returning a new object with the planet data and a new key containing the dark haired residents objects:
          return {
            ...eachPlanet,
            dark_haired_residents: darkHairedResidents,
          };
        });

      planetsArray = await Promise.all(filteredPlanetsArray);
    }

    res.send(planetsArray);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
