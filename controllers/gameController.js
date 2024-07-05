const Game = require("../models/game.model");
const User = require("../models/user.model");

module.exports.gameJoined = async (req, res) => {
  try {
    const id = req.userId;
    const user = await User.findById(id);

    if (!user) {
      return res
        .status(404)
        .json({ status: "failed", message: "User not found" });
    }

    let { title, score, status } = req.body;

    // Split title to get only the challenge part
    if (title) {
      const splitTitle = title.split(":");
      if (splitTitle.length > 1) {
        title = splitTitle[1].trim();
      }
    }

    const gameJoin = await Game.create({
      title: title,
      score: score,
      status: status,
      userId: id,
    });

    await gameJoin.save();
    res.status(201).json({
      status: "success",
      message: "Verification email sent",
      token: gameJoin,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "failed", message: "Unable to process request" });
  }
};
module.exports.updateScoreByUserId = async (req, res) => {
  try {
    const userId = req.userId; // Assuming userId is passed as a parameter
    let { score, status, title } = req.body; // Extract title from req.body
    if (title) {
      const splitTitle = title.split(":");
      if (splitTitle.length > 1) {
        title = splitTitle[1].trim();
      }
    }
    console.log(userId);
    // Build update object based on provided fields
    const updateFields = {};
    if (score !== undefined) {
      updateFields.score = score;

      // Check if the score reaches 10000
      if (score >= 10000) {
        // Check if the game has already been won by someone else
        const game = await Game.findOne({ title, status: "won" }); // Find game by title and status
        if (!game) {
          updateFields.status = "won"; // Set status to "won" if no one has won yet
        }
      }
    }
    if (status !== undefined) {
      updateFields.status = status; // Allow overriding status if provided
    }

    // Find the game where userId matches and update fields
    const game = await Game.findOneAndUpdate(
      { userId, title }, // Match by userId and title
      { $set: updateFields },
      { new: true }
    );

    if (!game) {
      return res
        .status(404)
        .json({ status: "failed", message: "Game not found for the user" });
    }

    // Update other players' statuses to "lose" if someone wins
    if (updateFields.status === "won") {
      await Game.updateMany(
        { _id: { $ne: game._id }, title, status: { $ne: "won" } }, // Exclude the current winner
        { $set: { status: "lose" } }
      );
    }

    res.status(200).json({
      status: "success",
      message: "Game updated successfully",
      data: game,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "failed", message: "Unable to update game" });
  }
};

module.exports.getGameDetails = async (req, res) => {
  try {
    console.log(req.params);
    const userId = req.userId; // Assuming userId is added to req in authentication middleware
    let { title } = req.params;
    if (title) {
      const splitTitle = title.split(":");
      if (splitTitle.length > 1) {
        title = splitTitle[1].trim();
      }
    }

    // Find the game where userId and title match
    const game = await Game.findOne({ userId: userId, title: title });

    if (!game) {
      return res
        .status(404)
        .json({ status: "failed", message: "Game not found" });
    }

    res.status(200).json({
      status: "success",
      game,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: "failed", message: "Unable to fetch game details" });
  }
};
