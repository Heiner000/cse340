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

// route to build account update view
router.get(
    "/update/:accountId",
    utilities.checkLogin,
    utilities.handleErrors(accountController.buildAccountUpdate)
);

// route to process account update
router.post(
    "/update",
    utilities.checkLogin,
    regValidate.accountUpdateRules(),
    regValidate.checkAccountUpdate,
    utilities.handleErrors(accountController.updateAccount)
);

// route to process password update
router.post(
    "/update-password",
    utilities.checkLogin,
    regValidate.passwordRules(),
    regValidate.checkPassword,
    utilities.handleErrors(accountController.updatePassword)
);

// logout route
router.get("/logout", utilities.handleErrors(accountController.logoutUser));

module.exports = router;
