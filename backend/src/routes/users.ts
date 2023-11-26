import express from "express";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

/* GET users listing. */
router.get("/", function (req: any, res) {
  const db = req.db;
  const users = db.get("users");
  users
    .find({ username: req.username }, { projection: { basicauthtoken: 0 } }) // return all user properties, except the basic auth token
    .then((docs) => res.json(docs))
    .catch(() => res.status(500).send());
});

/* add template to user entry */
router.post("/upload/:user", upload.single("file"), function (req: any, res) {
  const username = req.params.user;
  const users = req.db.get("users");

  users.findOne({ username: username }).then((user) => {
    if (!user) {
      return res.status(404).send("User not found");
    }

    const id = req.db.id();
    user.templates.push({
      _id: id,
      name: req.file.originalname ?? new Date().toISOString(),
      image: req.file.buffer.toString("base64"),
      type: req.file.mimetype,
      origin: req.query.origin,
    });
    console.log(id);

    users
      .update({ username: username }, { $set: { templates: user.templates } })
      .then(() => {
        return res.status(200).send({ id });
      });
  });
});

router.delete("/delete/:user/:id", function (req: any, res) {
  const username = req.params.user;
  const id = req.params.id;
  const users = req.db.get("users");

  users.findOne({ username: username }).then((user) => {
    if (!user) {
      return res.status(404).send("User not found");
    }

    const index = user.templates.findIndex((t) => t._id.toString() === id);
    if (index === -1) {
      return res.status(404).send("Template not found");
    }

    user.templates.splice(index, 1);

    users
      .update({ username: username }, { $set: { templates: user.templates } })
      .then(() => {
        return res.status(200).send();
      });
  });
});

router.get("/all/:user", function (req: any, res) {
  const username = req.params.user;
  const users = req.db.get("users");
  const origin = req.query.origin;

  users.findOne({ username: username }).then((user) => {
    if (!user) {
      return res.status(404).send("User not found");
    }

    res.send({
      templates: user.templates
        .filter((template) => {
          return origin ? template.origin === origin : true;
        })
        .map((template) => {
          return {
            id: template._id,
            name: template.name,
            origin: template.origin,
          };
        }),
    });
  });
});

router.get("/img/:user/:id", function (req: any, res) {
  const username = req.params.user;
  const id = req.params.id;
  const users = req.db.get("users");

  users.findOne({ username: username }).then((user) => {
    if (!user) {
      return res.status(404).send("User not found");
    }

    const template = user.templates.find((t) => t._id.toString() === id);
    if (!template) {
      return res.status(404).send("Template not found");
    }

    const imageBuffer = Buffer.from(template.image, "base64");
    res.set("Content-Type", template.type);
    res.end(imageBuffer);
  });
});

export default router;
