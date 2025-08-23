const express = require("express");
const morgan = require("morgan");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
const port = process.env.PORT || 3000;

const app = express();
dotenv.config();

const connectDB = require("./config/db");
connectDB();

const userRouter = require("./routes/user.routes");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use("/api/users", userRouter);

app.listen(port, () => {
  console.log(`server started on port ${port}`);
});
