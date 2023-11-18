import express from "express";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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

router.post("/upload", upload.single("file"), function (req: any, res) {
  const templates = req.db.get("templates");

  templates.insert(req.file).then((doc) => {
    res.send(doc._id);
  });
});

export default router;
