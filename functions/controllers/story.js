const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const { logger } = require("firebase-functions/v1");
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
    .limit(3)
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
      "a change in heart",
      "a simple continuation of the story",
      "a moral dialemma",
      "a relationship crisis",
      "a new friend",
      "a simple continuation of the story",
      "a flashback",
      "a flashforward",
      "a Encode London Hackathon",
      "a simple continuation of the story",
      "the Donald Trump 2024 Presidential Campaign",
      "an XBOX",
      "a plot twist",
      "a simple continuation of the story",
      "Greta Thunberg",
      "Elon Musk",
      "Kanye West",
      "a simple continuation of the story",
      "Boris Johnson",
      "Grand Theft Auto 5",
      "Macaroni cheese",
      "a simple continuation of the story",
      "a Pizza",
      "Sushi",
      "a Curry",
      "many Steins of beer",
      "a simple continuation of the story",
      "remembering that he had a job as a software engineer",
    ];

    // Debug: the story page document
    // logger.log("storyPageDocument:", storyPageDocument);

    /**
     * Next we're now going to generate the prompt
     * for ChatGPT to generate a new passage. We'll
     * construct the prompt below.
     */
    const completionContent = `Please continue the storyline for this passage up to a maximum of 100 words, but now incorporating ${
      storyDirections[Math.floor(Math.random() * storyDirections.length)]
    }: ${storyPageDocument.passage} and leave the story on a cliffhanger`;

    // Debug: the completed prompt
    // logger.log("completionContent:", completionContent);

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

    const messagesArray = [
      {
        role: "system",
        content: "You are a funny storytelling assistant",
      },
    ];

    for (let index = 0; index < storyPage.length; index++) {
      const thisPage = storyPage[index];

      messagesArray.push({
        role: "user",
        content: `And then, the next part of the story was ${
          thisPage.data().passage
        }`,
      });
    }

    messagesArray.push({
      role: "user",
      content: completionContent,
    });

    logger.log("messagesArray:", messagesArray);

    const chatCompletion = await openai.chat.completions.create({
      messages: messagesArray,
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
        logger.log(
          "Successfully generated new story page and linked to previous page"
        );

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
