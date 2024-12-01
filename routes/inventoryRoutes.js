// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/");

// Route to build inventory by classification view
router.get(
    "/type/:classificationId",
    utilities.handleErrors(invController.buildByClassificationId)
);

// Route to show vehicle detail
router.get(
    "/detail/:invId",
    utilities.handleErrors(invController.buildByInventoryId)
);

// Route to manage inventory
router.get("/", utilities.handleErrors(invController.buildManagement));

// route to trigger 500 error
router.get(
    "/trigger-error",
    utilities.handleErrors(invController.triggerError)
);

module.exports = router;
