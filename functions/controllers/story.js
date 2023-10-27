const { getFirestore } = require("firebase-admin/firestore");

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

const storyByPageId = async (req, res) => {
  const db = getFirestore();

  const storyPage = await db
    .collection("storybook")
    .doc(req.params.pageId)
    .get();

  if (typeof storyPage === Error) {
    return res.status(500).json({
      message: "Error retrieving story page",
    });
  } else {
    return res.json(storyPage.data());
  }
};

module.exports = {
  storyIntentPositive,
  storyIntentNegative,
  storyByPageId,
};
