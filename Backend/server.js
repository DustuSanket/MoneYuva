const express = require("express");
const morgan = require("morgan");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
const port = process.env.PORT || 3000;
const uploadRouter = require("./routes/upload.routes");

const app = express();
dotenv.config();

const connectDB = require("./config/db");
connectDB();

const userRouter = require("./routes/user.routes");
const walletRouter = require("./routes/wallet.routes");
const onboardingRouter = require("./routes/onboarding.routes");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));

app.use("/api/users", userRouter);
app.use("/api/wallet", walletRouter);
app.use("/api/upload", uploadRouter);
app.use("/api", onboardingRouter);

app.get("/", (req, res) => {
  res.send("Server is up and running!");
});

app.listen(port, () => {
  console.log(`server started on port ${port}`);
});
