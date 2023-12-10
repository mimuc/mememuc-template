import express from "express";
import bcrypt from "bcrypt";

const router = express.Router();

router.post("/", async (req: any, res) => {
  const db = req.db;
  const loginData = req.body;
  const users = db.get("users");

  const user = await users.findOne({ username: loginData.username });

  if (!user) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid username or password" });
  }

  const passwordMatch = await bcrypt.compare(loginData.password, user.password);

  if (passwordMatch) {
    res.status(200).json({ success: true, message: "Login successful" });
  } else {
    res
      .status(401)
      .json({ success: false, message: "Invalid username or password" });
  }
});

export default router;
