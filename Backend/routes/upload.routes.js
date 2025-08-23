const express = require("express");
const router = express.Router();
const multer = require("multer");

// Configure Multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/profile-photo", upload.single("profilePhoto"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  res.status(200).json({
    message: "File uploaded successfully",
    filePath: "/images/" + req.file.filename, // This is the URL to the image
  });
});

module.exports = router;
