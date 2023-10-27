// Core
const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const { initializeApp } = require("firebase-admin/app");

// Third Party
const express = require("express");

// Local
const storyRouter = require("./routes/story");

// Initialisation and instantiation

const app = express();
initializeApp();

// Middleware
app.use("/story", storyRouter);

exports.api = onRequest(app);
