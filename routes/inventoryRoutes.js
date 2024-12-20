// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/");
const invValidate = require("../utilities/inventory-validation");

// *********** UNPROTECTED ROUTES ************* //
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

// ! Enhancement - Route to manage comparison list
router.get(
    "/comparison",
    utilities.handleErrors(invController.buildComparisonView)
);

router.post(
    "/compare/add",
    utilities.handleErrors(invController.addToComparison)
);

// Route to remove vehicle from comparison
router.post(
    "/compare/remove",
    utilities.handleErrors(invController.removeFromComparison)
);

// *********** PROTECTED ROUTES *********** //
// Route to manage inventory
router.get(
    "/",
    utilities.checkAdminAuth,
    utilities.handleErrors(invController.buildManagement)
);

// route to build classification view
router.get(
    "/add-classification",
    utilities.checkAdminAuth,
    utilities.handleErrors(invController.buildAddClassification)
);

// route to process added classification form
router.post(
    "/add-classification",
    utilities.checkAdminAuth,
    invValidate.classificationRules(),
    invValidate.checkClassData,
    utilities.handleErrors(invController.addClassification)
);

// route to show add inventory form
router.get(
    "/add-inventory",
    utilities.checkAdminAuth,
    utilities.handleErrors(invController.buildAddInventory)
);

// route to process add inventory form
router.post(
    "/add-inventory",
    utilities.checkAdminAuth,
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
    utilities.checkAdminAuth,
    utilities.handleErrors(invController.buildEditInventoryView)
);

// route to handle incoming update requests
router.post(
    "/update/",
    utilities.checkAdminAuth,
    invValidate.inventoryRules(),
    invValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory)
);

// route to show item delete confirmation view
router.get(
    "/delete/:inv_id",
    utilities.checkAdminAuth,
    utilities.handleErrors(invController.buildDeleteConfirmView)
);

// route to process item deletion
router.post(
    "/delete",
    utilities.checkAdminAuth,
    utilities.handleErrors(invController.deleteInventoryItem)
);

// route to trigger 500 error
router.get(
    "/trigger-error",
    utilities.handleErrors(invController.triggerError)
);

module.exports = router;
