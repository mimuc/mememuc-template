import express from "express";
import bcrypt from "bcrypt";

const router = express.Router();

router.post("/", async (req: any, res) => {
  const db = req.db;
  const userData = req.body;
  const users = db.get("users");

  // Überprüfen, ob Benutzername oder E-Mail bereits existieren
  const existingUser = await users.findOne({
    $or: [{ username: userData.username }, { email: userData.email }],
  });

  if (existingUser) {
    // Benutzername oder E-Mail ist bereits vorhanden
    return res
      .status(400)
      .send("Benutzername oder E-Mail ist bereits vergeben");
  }
  //Passwort hashen
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  // Wenn Benutzername und E-Mail nicht vorhanden sind, füge den Benutzer hinzu
  users.insert({ ...userData, password: hashedPassword }, (err, user) => {
    if (err) {
      return res.status(500).send("Fehler beim Speichern des Nutzers");
    } else {
      return res.status(200).json({ success: true });
    }
  });
});

export default router;
