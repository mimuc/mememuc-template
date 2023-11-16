import express from "express";

const router = express.Router();

/* GET all templates. */
router.get("/all", function (req: any, res) {
  const templates = req.db.get("templates");
  templates.find({}).then((docs) => {
    res.send(docs);
  });
});

export default router;
