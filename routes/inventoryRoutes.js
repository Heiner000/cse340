// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/");
const invValidate = require("../utilities/inventory-validation");

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

// route to build classification view
router.get(
    "/add-classification",
    utilities.handleErrors(invController.buildAddClassification)
);

// route to process added classification form
router.post(
    "/add-classification",
    invValidate.classificationRules(),
    invValidate.checkClassData,
    utilities.handleErrors(invController.addClassification)
);

// route to show add inventory forom
router.get(
    "/add-inventory",
    utilities.handleErrors(invController.buildAddInventory)
);

// route to process add inventory form
router.post(
    "/add-inventory",
    invValidate.inventoryRules(),
    invValidate.checkInventoryData,
    utilities.handleErrors(invController.addInventory)
);

// route to get inventory by classification id
router.get(
    "/getInventory/:classification_id",
    utilities.handleErrors(invController.getInventoryJSON)
);

// route to get inventory modification form
router.get(
    "/edit/:inv_id",
    utilities.handleErrors(invController.buildEditInventoryView)
);

// route to handle incoming update requests
router.post(
    "/update/",
    invValidate.inventoryRules(),
    invValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory)
);

// route to show item delete confirmation view
router.get(
    "/delete/:inv_id",
    utilities.handleErrors(invController.buildDeleteConfirmView)
);

// route to process item deletion
router.post(
    "/delete",
    utilities.handleErrors(invController.deleteInventoryItem)
);

// route to trigger 500 error
router.get(
    "/trigger-error",
    utilities.handleErrors(invController.triggerError)
);

module.exports = router;
