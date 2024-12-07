const utilities = require(".");
const { body, validationResult } = require("express-validator");
const validate = {};
// const inventoryModel = require("../models/inventory-model");

/*  **********************************
 *  Classification Data Validation Rules
 * ********************************* */
validate.classificationRules = () => {
    return [
        body("classification_name")
            .trim()
            .isAlphanumeric()
            .isLength({ min: 1 })
            .withMessage("Please provide a classification name.")
            .matches(/^[a-zA-Z0-9]+$/)
            .withMessage(
                "Classification name can only contain letters and numbers."
            ),
    ];
};

/*  **********************************
 *  Check data and return errors
 * ********************************* */
validate.checkClassData = async (req, res, next) => {
    const { classification_name } = req.body;
    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        res.render("inventory/add-classification", {
            errors,
            title: "Add Classification",
            nav,
            classification_name,
        });
        return;
    }
    next();
};

/*  **********************************
 *  Inventory validation rules
 * ********************************* */
validate.inventoryRules = () => {
    return [
        body("classification_id")
            .notEmpty()
            .withMessage("Please select a classification"),

        body("inv_make")
            .trim()
            .isLength({ min: 3 })
            .withMessage("Make must be at least 3 characters"),

        body("inv_model")
            .trim()
            .isLength({ min: 3 })
            .withMessage("Model must be at least 3 characters"),

        body("inv_year")
            .trim()
            .isLength({ min: 4, max: 4 })
            .isNumeric()
            .withMessage("Year must be 4 digits"),

        body("inv_description")
            .trim()
            .isLength({ min: 10 })
            .withMessage("Description must be at least 10 characters"),

        body("inv_price")
            .trim()
            .isNumeric()
            .withMessage("Price must be a valid number"),

        body("inv_miles")
            .trim()
            .isNumeric()
            .withMessage("Mileage must be a valid number"),

        body("inv_color")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please specify a color"),
    ];
};

/*  **********************************
 *  Check inv data and return errors
 * ********************************* */
validate.checkInventoryData = async (req, res, next) => {
    const {
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id,
    } = req.body;

    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        let classList = await utilities.buildClassificationList(
            classification_id
        );
        res.render("inventory/add-inventory", {
            title: "Add New Vehicle",
            nav,
            classList,
            errors,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id,
        });
        return;
    }
    next();
};

module.exports = validate;
