const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const validUrl = require("valid-url");
// const shortId = require('shortid');
require("dotenv").config();

const app = express();

/** Set Up Mongoose **/

mongoose.connect(process.env.MONGO_URI.trim(), {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

/** Create a Model **/

const urlSchema = new mongoose.Schema({
  original_url: { type: String, required: true },
  short_url: { type: Number, required: true },
});

const UrlModel = mongoose.model("url", urlSchema);

/** Helper functions **/

const isValidUrl = (url) => {
  let result = true;
  if (validUrl.isWebUri(url) === undefined) result = false;
  return result;
};

// /**
//  * shortId.generate() generates an alphanumeric
//  * Id that is not compatible with freecodecamp user stories. */
// const newShortUrl = () => {
//  return shortId.generate();
// };

/** Set Up Express Middlewares **/

app.use(express.urlencoded({ extended: false })); // request parser mw
app.use(cors({ optionsSuccessStatus: 200 })); // cors mw
app.use(express.static("public")); // assets mw

/** Routes **/

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/api/hello", (req, res) => {
  res.json({ greeting: "hello API" });
});

app.get("/api/test", (req, res) => {
  res.json({ test: newShortUrl2() });
});

// POST (shorturl)

app.post("/api/shorturl", async (req, res) => {
  const url = req.body.url;

  if (!isValidUrl(url)) {
    return res.json({ error: "invalid url" });
  }

  try {
    let foundUrl = await UrlModel.findOne({ original_url: url });

    if (!foundUrl) {

      let maxShortUrl = await UrlModel
        .find()
        .sort({short_url: "desc"})
        .limit(1)
        .then(docs => {
          if (docs.length) {
            return docs[0].short_url;
          } else {
            return 0;
          }
        }).catch(err => {
          console.log(err);
        });
      
      foundUrl = new UrlModel({
        original_url: url,
        short_url: maxShortUrl + 1,
      });
      await foundUrl.save();
    }

    res.json({
      original_url: foundUrl.original_url,
      short_url: foundUrl.short_url,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json("Server error");
  }
});

// GET (shorturl)

app.get("/api/shorturl/:shortUrl?", async (req, res) => {
  try {
    const foundUrl = await UrlModel.findOne({
      short_url: req.params.shortUrl,
    });
    if (!foundUrl) {
      return res.status(404).json({ error: "no url found" });
    }

    res.redirect(foundUrl.original_url);
  } catch (err) {
    console.error(err);
    res.status(500).json("Server error");
  }
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
