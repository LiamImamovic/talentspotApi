// app.js
const express = require("express");
const morgan = require("morgan");
const { sequelize } = require("./db/sequelize");

var cors = require("cors");
const port = 3000;
const app = express();

app.use(cors());

app.use(morgan("dev")).use(express.json());

const userRouter = require("./routes/userRoutes");

app.use("/api/users", userRouter);

app.listen(port, () => {
  console.log(`L'app sur le port ${port}`);
});
