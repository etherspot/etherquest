// Third Party
const Router = require("express").Router;

// Locat
const {
  storyIntentPositive,
  storyIntentNegative,
  storyByPageId,
} = require("../controllers/story");

// Initialisation and instantiation
const router = Router();

router.get("/:pageId/intent/positive", storyIntentPositive);
router.get("/:pageId/intent/negative", storyIntentNegative);
router.get("/:pageId", storyByPageId);

module.exports = router;
