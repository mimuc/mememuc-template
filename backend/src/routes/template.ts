import express from "express";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

router.get("/:id", function (req: any, res) {
  const id = req.params.id;
  const templates = req.db.get("templates");
  templates.findOne({ _id: id }).then((doc) => {
    console.log(doc);
    res.send(doc);
  });
});

router.get("/all", function (req: any, res) {
  const templates = req.db.get("templates");
  templates.find({}).then((docs) => {
    res.send(docs);
  });
});

router.post("/upload", upload.single("file"), function (req: any, res) {
  console.log(req.file);

  const fileData = req.file;
  const templates = req.db.get("templates");

  console.log(fileData);

  templates.insert(req.file).then((doc) => {
    res.send(doc._id);
  });
});

export default router;
