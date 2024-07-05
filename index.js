const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const authController = require("./controllers/auth_controller");

dotenv.config();

// CORS configuration
app.use(cors({
  origin: "http://192.168.1.8:8081", // Update with your production domain
}));

// Serving static files
app.use("/public", express.static(__dirname + "/public"));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.get("/", authController.start);
app.use("/api", require("./routes"));

// MongoDB connection
const dbURI = process.env.MONGO_URL;
mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("Connected to MongoDB");

  // Start the server
  const port = process.env.PORT || 8080;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
})
.catch((error) => {
  console.error("Error connecting to MongoDB:", error.message);
});
