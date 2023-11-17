import express from "express";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

router.get("/:id", function (req: any, res) {
  const id = req.params.id;
  const templates = req.db.get("templates");
  templates.findOne({ _id: id }).then((doc) => {
    if (!doc || !doc.buffer) {
      return res.status(404).send("Image not found");
    }

    const imageBuffer = doc.buffer.buffer;
    res.set("Content-Type", doc.mimetype);
    res.send(imageBuffer);
  });
});

router.get("/all", function (req: any, res) {
  const templates = req.db.get("templates");
  templates.find({}).then((docs) => {
    res.send(docs);
  });
});

router.post("/upload", upload.single("file"), function (req: any, res) {
  const templates = req.db.get("templates");

  templates.insert(req.file).then((doc) => {
    res.send(doc._id);
  });
});

export default router;
