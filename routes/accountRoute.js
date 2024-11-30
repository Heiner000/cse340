// Needed Resources
const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");

// route for my account
router.get(
    "/type/:accountId",
    utilities.handleErrors(accountController.buildByAccountId)
);

module.exports = router;
