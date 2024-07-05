const express = require("express");
const router = express.Router();

const {
  userRegistration,
  userLogin,
  userById,
} = require("../controllers/userController.js");

const authMiddleware = require("../middleware/jwt_authMiddleware.js");
const {
  gameJoined,
  updateScoreByUserId,
  getGameDetails,
} = require("../controllers/gameController.js");
router.post("/register", userRegistration);
router.post("/login", userLogin);
router.post("/gameJoin", authMiddleware, gameJoined);
router.post("/login", userLogin);
router.patch("/updateScore", authMiddleware, updateScoreByUserId);
router.get("/userById", authMiddleware, userById);
router.get("/gameDetails/:title", authMiddleware, getGameDetails);

module.exports = router;
