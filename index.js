const express = require("express");
const app = express();
const { port } = require("./constants");

app.use(express.json());

const characterRouter = require("./routers/character");

app.use("/character", characterRouter);

app.listen(port, () => console.log(`Listening on port ${port}`));
