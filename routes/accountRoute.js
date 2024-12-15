// Needed Resources
const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");
const regValidate = require("../utilities/account-validation");
const Util = require("../utilities");

// route for my account login
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// route for registration view
router.get(
    "/register",
    utilities.handleErrors(accountController.buildRegister)
);

// process the account registration
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
);

// Process the login request
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
);

// route to build default account management view
router.get(
    "/",
    utilities.checkLogin,
    utilities.handleErrors(accountController.buildAccountManagement)
);

module.exports = router;
