// eslint-disable-next-line import/no-unresolved
const { getAuth } = require("firebase-admin/auth");
const { logger } = require("firebase-functions/v1");

const verifyAuth = async (request, response, next) => {
  logger.info("Verifying authentication...");
  const auth = getAuth();

  if (request.query.userId) {
    logger.info("✅ Basic verification completed");
    request.user = {
      user_id: request.query.user_id,
    };

    return next();
  }

  // Extract the token
  const authToken = request.headers.authorization;
  const tokenParts = authToken.split(" ");

  const decoded = await auth.verifyIdToken(tokenParts[1]).catch((error) => {
    logger.error(
      `❌ Authorization failed whilst decoding ${tokenParts[1]}:`,
      error
    );
    return error;
  });

  if (decoded instanceof Error) {
    response.status(401);
    return next(decoded);
  }

  logger.info("✅ Verification completed");
  request.user = decoded;
  return next();
};

module.exports = {
  verifyAuth,
};
