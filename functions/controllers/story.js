const storyIntentPositive = (req, res) => {
  return res.json({
    message: "Hello Story! Positive intent",
  });
};

const storyIntentNegative = (req, res) => {
  return res.json({
    message: "Hello Story! Nevative intent",
  });
};

module.exports = {
  storyIntentPositive,
  storyIntentNegative,
};
