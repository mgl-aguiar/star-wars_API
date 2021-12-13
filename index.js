const express = require("express");
const app = express();
const { port } = require("./constants");

app.use(express.json());

const charactersRouter = require("./routers/characters");

app.use("/characters", charactersRouter);

app.listen(port, () => console.log(`Listening on port ${port}`));
