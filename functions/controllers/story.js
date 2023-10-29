const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const OpenAI = require("openai").OpenAI;
const { v4: uuidv4 } = require("uuid");

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

const storyAutogenerate = async (req, res) => {
  const db = getFirestore();
  const docId = uuidv4();

  /**
   * First, get the latest story page.
   * We are going to need this throughout
   * this process.
   */
  const storyPage = await db
    .collection("storybook")
    .orderBy("createdAt", "desc")
    .limit(1)
    .get();

  // Was there an error?
  if (typeof storyPage === Error) {
    return res.status(500).json({
      message: "Error retrieving story pages",
    });

    // Otherwise continue...
  } else {
    // Get the document data
    const storyPageDocument = storyPage.docs[0].data();

    /**
     * These are story directions - this helps
     * vary and alter the story each time we ask
     * ChatGPT to generate a new passage.
     */
    const storyDirections = [
      "change in heart",
      "simple continuation of the story",
      "moral dialemma",
      "relationship crisis",
      "new friend",
      "simple continuation of the story",
      "flashback",
      "flashforward",
      "Encode London Hackathon",
      "simple continuation of the story",
      "Donald Trump 2024 Presidential Campaign",
      "XBOX",
      "plot twist",
      "simple continuation of the story",
      "Greta Thunberg",
      "Elon Musk",
      "Kanye West",
      "simple continuation of the story",
      "Boris Johnson",
      "Grand Theft Auto 5",
      "Macaroni cheese",
      "simple continuation of the story",
      "Pizza",
      "Sushi",
      "Curry",
      "Stein of beer",
      "simple continuation of the story",
    ];

    // Debug: the story page document
    console.log("storyPageDocument:", storyPageDocument);

    /**
     * Next we're now going to generate the prompt
     * for ChatGPT to generate a new passage. We'll
     * construct the prompt below.
     */
    const completionContent = `Please continue the storyline for this passage up to a maximum of 100 words, but now incorporating a ${
      storyDirections[Math.floor(Math.random() * storyDirections.length)]
    }: ${storyPageDocument.passage}`;

    // Debug: the completed prompt
    console.log("completionContent:", completionContent);

    /**
     * Next let's instantiate the OpenAI API
     */
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    /**
     * Set up the call to create and send the
     * prompt. We're going to program the assistant
     * to be a bit funny for entertainment purposes.
     */
    const chatCompletion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a funny storytelling assistant",
        },
        {
          role: "user",
          content: completionContent,
        },
      ],
      model: "gpt-3.5-turbo",
    });

    // Was there an error?
    if (typeof chatCompletion === Error) {
      return res.status(500).json({
        message: "Error generating story",
        error: chatCompletion,
      });

      // Otherwise continue...
    } else {
      /**
       * So we've got our new passage back from OpenAI.
       * Lets write this to the database as a new story page.
       * Note: We're using a prepopulated document ID here
       * but as random as possible to avoid hotspotting in Firestore.
       * We'll also need this precomputed document ID below.
       */
      const newStoryPage = await db.collection("storybook").doc(docId).set({
        passage: chatCompletion.choices[0].message.content,
        createdAt: FieldValue.serverTimestamp(),
        fromIntent: "positive",
      });

      /**
       * Now we've created a new story page, lets update
       * the previous story page with the generated document ID
       * of the new story page. This will create a link between
       * the two story pages from the previous page to the new page.
       */
      const positiveIntentLinkUpdate = await db
        .collection("storybook")
        .doc(storyPage.docs[0].id)
        .update({
          positiveIntentPageId: docId,
          positiveIntentText: "Continue",
        });

      // Was there an error?
      if (typeof positiveIntentLinkUpdate === Error) {
        return res.status(500).json({
          message: "Error updating story with new page",
          error: positiveIntentLinkUpdate,
        });

        // Otherwise continue...
      } else {
        return res.json({
          positiveIntentLinkUpdate,
          newStoryPage,
          chatCompletion,
        });
      }
    }
  }
};

module.exports = {
  storyIntentPositive,
  storyIntentNegative,
  storyByPageId,
  storyAutogenerate,
};
