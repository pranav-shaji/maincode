const express = require("express");
let router = express.Router();
const user = require("../schemaValidation/userschemaValidation.js");
let bcrypt = require("bcrypt");
let jwt = require("jsonwebtoken");
const validate = require("../middleware/validate.js");
const nodemailer = require("nodemailer");
let otp = require("../otp.js");
const multer = require("multer");
let path = require("path"); //fie

let d = new Date();
console.log(d);
console.log(d.getTime());
console.log(Date.now());
// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Destination folder where files will be saved
  },
  filename: function (req, file, cb) {
    cb(null, "pranav" + "-" + Date.now() + path.extname(file.originalname)); // File naming convention
  },
});

const upload = multer({ storage: storage });

const transporter = nodemailer.createTransport({
  service: "gmail",
  // port: 587,
  // secure: false,
  auth: {
    user: "pranavshaji2244@gmail.com",
    pass: "zlvg bthk ydrj rhzr",
  },
  // debug: true,
});

router.post("/signup", async (req, res) => {
  console.log("hhdhhhdhd");
  if (req.body.email === "" || req.body.password === "") {
    res.json({ message: "All fields are required" });
    return;
  }
  let result = await user.findOne({ email: req.body.email });
  console.log(result);
  if (result) {
    res.json({ message: "user  already exists with this email id." });
  }
  try {
    if (!result) {
      let enPassword = await bcrypt.hash(req.body.password, 10);
      await user.create({ email: req.body.email, password: enPassword });
      res.json({ message: "user created" });
      return;
    }
  } catch (error) {
    console.log(error);
    res.json({ message: "server error", error });
  }
});
router.post("/login", async (req, res) => {
  // console.log(req.body);
  if (req.body.email === "" || req.body.password === "") {
    res.json({ message: "all fields are required" });
    return;
  }
  try {
    let result = await user.findOne({ email: req.body.email });
    console.log(result);
    if (result === null) {
      res.json({ message: "signup first" });
    } else {
      let pass = await bcrypt.compare(req.body.password, result.password);
      console.log(pass);
      if (pass) {
        let token = jwt.sign(req.body, "123", { expiresIn: "60m" });
        console.log(token);
        res.status(200).json(token);
      } else {
        res.status(200).json("wrong password");
      }
    }
  } catch (error) {
    res.json({ message: "server error", error });
  }
});
router.get("/get-all-users", validate, async (req, res) => {
  let result = await user.find();
  console.log(result);
  res.json({ message: "data fetch sucessfull", result });
});

// zlvg bthk ydrj rhzr
router.post("/get-otp", async (req, res) => {
  console.log(req.body);
  let newOtp = otp();
  let result = await user.updateOne(
    { email: req.body.email },
    {
      $set: { otp: newOtp },
    }
  );
  console.log(result);
  if (result.acknowledged) {
    const mailOption = {
      from: "pranavshaji2244@gmail.com",
      to: req.body.email,
      subject: "otp for verification",
      text: newOtp,
    };
    transporter.sendMail(mailOption, (error, info) => {
      if (error) {
        console.error("error occured");
      } else {
        console.log("email sent");
        res.json("otp sent");
      }
    });
  }
});

router.post("/verify-otp", async (req, res) => {
  let result = await user.findOne({ email: req.body.email });
  if (result) {
    if (result.otp == req.body.otp) {
      res.json("login successful");
    } else {
      res.json("login failed");
    }
  }
});
router.post(
  "/image-upload/:email",
  upload.array("image", 2),
  async (req, res) => {
    console.log(req.files);

    let arr = [];
    for (i = 0; i < req.files.length; i++) {
      arr.push(req.files[i].filename);
    }
    try {
      let result = await user.updateOne(
        { email: req.params.email },
        {
          $set: {
            image: arr,
          },
        }
      );
      console.log(result);

      if (result.modifiedCount === 1) {
        res.json({ message: "file uploaded" });
      } else {
        res.json(404).send("no image found");
      }

      console.log(result);
    } catch (error) {
      res.json(err);
    }
  }
);

module.exports = router;
