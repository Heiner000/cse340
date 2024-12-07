const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(
        classification_id
    );
    const grid = await utilities.buildClassificationGrid(data);
    let nav = await utilities.getNav();
    const className = data[0].classification_name;
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
        // errors: null,
    });
};

/* ****************************************
 *  Deliver classification view
 * *************************************** */
invCont.buildAddClassification = async function (req, res, next) {
    let nav = await utilities.getNav();
    res.render("./inventory/add-classification", {
        title: "Add Classification",
        nav,
        errors: null,
    });
};

/* ***************************
 *  Build detail by inventory id view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
    const inv_id = req.params.invId;
    const data = await invModel.getInventoryByInvId(inv_id);

    let nav = await utilities.getNav();
    const title = `${data.inv_year} ${data.inv_make} ${data.inv_model}`;

    res.render("./inventory/detail", {
        title,
        nav,
        vehicle: data,
        // errors: null,
    });
};

/* ***************************
 *  Deliver management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
    let nav = await utilities.getNav();
    res.render("./inventory/management", {
        title: "Vehicle Management",
        nav,
        errors: null,
    });
};

/* ****************************************
 *  Process add Classification
 * *************************************** */
invCont.addClassification = async function (req, res, next) {
    const { classification_name } = req.body;
    const addResult = await invModel.addClassification(classification_name);

    if (addResult.rowCount > 0) {
        let nav = await utilities.getNav();
        req.flash(
            "notice",
            `The ${classification_name} classification was successfully added.`
        );
        res.status(201).render("inventory/management", {
            title: "Vehicle Management",
            nav,
            errors: null,
        });
    } else {
        let nav = await utilities.getNav();
        req.flash("notice", "Sorry, adding the classification failed.");
        res.status(501).render("inventory/add-classification", {
            title: "Add Classification",
            nav,
            errors: null,
        });
    }
};

/* ***************************
 *  Build add inventory view
 * ************************** */
invCont.buildAddInventory = async function (req, res) {
    let nav = await utilities.getNav();
    let classList = await utilities.buildClassificationList();
    res.render("inventory/add-inventory", {
        title: "Add New Vehicle",
        nav,
        classList,
        errors: null,
    });
};

/* ***************************
 *  Build add inventory view
 * ************************** */

invCont.addInventory = async function (req, res) {
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

    const result = await invModel.addInventory(
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id
    );

    if (result) {
        req.flash(
            "notice",
            `The ${inv_make} ${inv_model} was successfully added.`
        );
        res.status(201).render("inventory/management", {
            title: "Vehicle Management",
            nav: await utilities.getNav(),
            errors: null,
        });
    } else {
        const classList = await utilities.buildClassificationList(
            classification_id
        );
        req.flash("notice", "Sorry, adding vehicle failed.");
        res.status(501).render("inventory/add-inventory", {
            title: "Add New Vehicle",
            nav: await utilities.getNav(),
            classList,
            errors: null,
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
    }
};

/* ********** */

/* ***************************
 *  Build error test function
 * ************************** */
invCont.triggerError = async function (req, res, next) {
    const error = new Error("Intentional 500 error for testing");
    error.status = 500;
    throw error;
};

module.exports = invCont;
