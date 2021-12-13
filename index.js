const express = require("express");
const app = express();
const { port, apiUrl } = require("./constants");

app.listen(port, () => console.log(`Listening on port ${port}`));
