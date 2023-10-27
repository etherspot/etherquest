// Third Party
const Router = require("express").Router;

// Locat
const {
  storyIntentPositive,
  storyIntentNegative,
} = require("../controllers/story");

// Initialisation and instantiation
const router = Router();

router.get("/", (req, res) => {
  res.send("Hello Story!");
});

router.get("/intent/positive", storyIntentPositive);
router.get("/intent/negative", storyIntentNegative);

module.exports = router;
