const express = require("express");
const cors = require("cors");

const app = express();
const { port } = require("./constants");

app.use(express.json());
app.use(cors());

const charactersRouter = require("./routers/characters");
const planetsRouter = require("./routers/planets");

app.use("/characters", charactersRouter);
app.use("/planets", planetsRouter);

app.listen(port, () => console.log(`Listening on port ${port}`));
