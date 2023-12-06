import express from "express";

const router = express.Router();

router.post("/save", async (req: any, res) => {
  try {
    console.log(req.body.memeData);
    const db = req.db;
    const base64Data = req.body.memeData;
    const type = req.body.type;
    const timestamp = req.body.timestamp;
    const username = req.body.username;

    // Decode base64 data
    // const binaryData = Buffer.from(base64Data, "base64");

    // Assuming you have a collection named "memes" in your MongoDB
    const memes = db.get("memes");

    // Insert the meme data into the MongoDB collection
    const result = await memes.insert({
      memeData: base64Data,
      type: type,
      timestamp: timestamp,
      username: username,
    });

    console.log("Meme saved to MongoDB:", result);

    res
      .status(200)
      .json({ message: "Meme saved to MongoDB", memeId: result._id });
  } catch (error) {
    console.error("Error saving meme to MongoDB:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
