import express from "express";

const router = express.Router();

/* GET users listing. */
router.get("/", function (req: any, res, next) {
  const db = req.db;
  const users = db.get("users");
  users
    .find({ username: req.username }, { projection: { basicauthtoken: 0 } }) // return all user properties, except the basic auth token
    .then((docs) => res.json(docs))
    .catch((e) => res.status(500).send());
});

export default router;
