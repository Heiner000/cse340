const utilities = require(".");
const { body, validationResult } = require("express-validator");
const validate = {};
const accountModel = require("../models/account-model");

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registationRules = () => {
    return [
        // firstname is required and must be string
        body("account_firstname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide a first name."), // on error this message is sent.

        // lastname is required and must be string
        body("account_lastname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 2 })
            .withMessage("Please provide a last name."), // on error this message is sent.

        // valid email is required and cannot already exist in the database
        body("account_email")
            .trim()
            .isEmail()
            .normalizeEmail() // refer to validator.js docs
            .withMessage("A valid email is required.")
            .custom(async (account_email) => {
                const emailExists = await accountModel.checkExistingEmail(
                    account_email
                );
                if (emailExists) {
                    throw new Error(
                        "Email exists. Please log in or use different email"
                    );
                }
            }),

        // password is required and must be strong password
        body("account_password")
            .trim()
            .notEmpty()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage("Password does not meet requirements."),
    ];
};

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body;
    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        res.render("account/register", {
            errors,
            title: "Registration",
            nav,
            account_firstname,
            account_lastname,
            account_email,
        });
        return;
    }
    next();
};

/*  **********************************
 *  Login Validation Rules
 * ********************************* */
validate.loginRules = () => {
    return [
        // email is required in valid format
        body("account_email")
            .trim()
            .isEmail()
            .normalizeEmail()
            .withMessage("A valid email is required."),

        // password validation
        body("account_password")
            .trim()
            .notEmpty()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage("Password doesn't meet requirements."),
    ];
};

/* ******************************
 * Check data and return errors or continue to login
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
    const { account_email } = req.body;
    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        res.render("account/login", {
            errors,
            title: "Login",
            nav,
            account_email,
        });
        return;
    }
    next();
};

/*  **********************************
 *  Account Update Rules
 * ********************************* */
validate.accountUpdateRules = () => {
    return [
        body("account_firstname")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide a first name."),
        body("account_lastname")
            .trim()
            .isLength({ min: 2 })
            .withMessage("Please provide a last name."),
        body("account_email")
            .trim()
            .isEmail()
            .normalizeEmail()
            .withMessage("A valid email is required.")
            .custom(async (account_email, { req }) => {
                const account_id = req.body.account_id;
                const emailExists = await accountModel.checkExistingEmail(
                    account_email
                );
                const existingAccount = await accountModel.getAccountByEmail(
                    account_email
                );

                if (emailExists && existingAccount.account_id != account_id) {
                    throw new Error(
                        "Email exists. Please use a different email."
                    );
                }
                return true;
            }),
    ];
};

/*  **********************************
 *  Password Update Rules
 * ********************************* */
validate.passwordRules = () => {
    return [
        body("account_password")
            .trim()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage("Password does not meet requirements."),
    ];
};

/* ******************************
 * Check account update data and return errors
 * ***************************** */
validate.checkAccountUpdate = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email, account_id } =
        req.body;
    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        res.render("account/update", {
            errors,
            title: "Update Account",
            nav,
            account_firstname,
            account_lastname,
            account_email,
            account_id,
        });
        return;
    }
    next();
};

/* ******************************
 * Check password data and return errors
 * ***************************** */
validate.checkPassword = async (req, res, next) => {
    const { account_id } = req.body;
    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        res.render("account/update", {
            errors,
            title: "Update Account",
            nav,
            account_id,
        });
        return;
    }
    next();
};

module.exports = validate;
