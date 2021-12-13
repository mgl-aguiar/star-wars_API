const { Router } = require("express");
const router = new Router();
const axios = require("axios");

const { apiUrl } = require("../constants");

// test endpoint, get all characters
router.get("/all", async (request, response, next) => {
  try {
    const characters = await axios.get(`${apiUrl}/people`);
    response.send(characters.data);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
