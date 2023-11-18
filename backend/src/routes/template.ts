import express from "express";

const router = express.Router();

router.get("/img/:id", function (req: any, res) {
  const id = req.params.id;
  const templates = req.db.get("templates");
  templates.findOne({ _id: id }).then((doc) => {
    if (!doc || !doc.image) {
      return res.status(404).send("Image not found");
    }
    const imageBuffer = Buffer.from(doc.image, "base64");
    res.set("Content-Type", doc.type);
    res.end(imageBuffer);
  });
});

router.get("/random", function (req: any, res) {
  const templates = req.db.get("templates");
  templates
    .aggregate([{ $sample: { size: 1 } }])
    .then((docs) => {
      res.send({
        id: docs[0]._id,
        name: docs[0].name,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/all", function (req: any, res) {
  const templates = req.db.get("templates");
  templates.find({}).then((docs) => {
    res.send({
      templates: docs.map((doc) => {
        return {
          id: doc._id,
          name: doc.name,
        };
      }),
    });
  });
});

export default router;
