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
 *  Deliver inventory management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
    let nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationList();
    res.render("./inventory/management", {
        title: "Vehicle Management",
        nav,
        classificationSelect,
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
 *  Add inventory
 * ************************** */

invCont.addInventory = async function (req, res) {
    let nav = await utilities.getNav();
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
        let classificationSelect = await utilities.buildClassificationList();
        req.flash(
            "notice",
            `The ${inv_make} ${inv_model} was successfully added.`
        );
        res.status(201).render("inventory/management", {
            title: "Vehicle Management",
            nav,
            classificationSelect,
            errors: null,
        });
    } else {
        let classificationSelect = await utilities.buildClassificationList(
            classification_id
        );
        req.flash("notice", "Sorry, adding vehicle failed.");
        res.status(501).render("inventory/add-inventory", {
            title: "Add New Vehicle",
            nav,
            classificationSelect,
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
    const classification_id = parseInt(req.params.classification_id);
    const invData = await invModel.getInventoryByClassificationId(
        classification_id
    );
    if (invData && invData.length > 0) {
        // Check if data exists and has elements
        return res.json(invData);
    } else {
        next(new Error("No data returned"));
    }
};

/* ****************************************
 *  Build edit inventory view
 * *************************************** */
invCont.buildEditInventoryView = async function (req, res, next) {
    try {
        const inv_id = parseInt(req.params.inv_id);
        let nav = await utilities.getNav();

        // Get the inventory data
        const itemData = await invModel.getInventoryByInvId(inv_id);
        if (!itemData) {
            req.flash("notice", "Sorry, we couldn't find that inventory item");
            return res.redirect("/inv/");
        }

        // Build classification dropdown with current item's classification selected
        const classificationSelect = await utilities.buildClassificationList(
            itemData.classification_id
        );

        const itemName = `${itemData.inv_make} ${itemData.inv_model}`;

        res.render("./inventory/edit-inventory", {
            title: "Edit " + itemName,
            nav,
            classificationSelect,
            errors: null,
            inv_id: itemData.inv_id,
            inv_make: itemData.inv_make,
            inv_model: itemData.inv_model,
            inv_year: itemData.inv_year,
            inv_description: itemData.inv_description,
            inv_image: itemData.inv_image,
            inv_thumbnail: itemData.inv_thumbnail,
            inv_price: itemData.inv_price,
            inv_miles: itemData.inv_miles,
            inv_color: itemData.inv_color,
            classification_id: itemData.classification_id,
        });
    } catch (error) {
        next(error);
    }
};

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
    try {
        let nav = await utilities.getNav();
        const {
            inv_id,
            inv_make,
            inv_model,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_year,
            inv_miles,
            inv_color,
            classification_id,
        } = req.body;

        // Build the classification select list
        const classificationSelect = await utilities.buildClassificationList(
            classification_id
        );

        // Parse values that should be integers
        const parsedInvId = parseInt(inv_id);
        const parsedClassificationId = parseInt(classification_id);

        const updateResult = await invModel.updateInventory(
            parsedInvId,
            inv_make,
            inv_model,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_year,
            parseInt(inv_miles),
            inv_color,
            parsedClassificationId
        );

        if (updateResult) {
            const itemName =
                updateResult.inv_make + " " + updateResult.inv_model;
            req.flash("notice", `The ${itemName} was successfully updated.`);
            res.redirect("/inv/");
        } else {
            const classificationSelect =
                await utilities.buildClassificationList(classification_id);
            const itemName = `${inv_make} ${inv_model}`;
            req.flash("notice", "Sorry, the insert failed.");
            res.status(501).render("inventory/edit-inventory", {
                title: "Edit " + itemName,
                nav,
                classificationSelect,
                errors: null,
                inv_id,
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
    } catch (error) {
        console.error("Error in updateInventory controller: ", error);
        next(error);
    }
};

/* ***************************
 *  Build delete confirmation view
 * ************************** */
invCont.buildDeleteConfirmView = async function (req, res, next) {
    const inv_id = parseInt(req.params.inv_id);
    let nav = await utilities.getNav();
    const itemData = await invModel.getInventoryByInvId(inv_id);
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`;

    res.render("./inventory/delete-confirm", {
        title: "Delete " + itemName,
        nav,
        errors: null,
        inv_id: itemData.inv_id,
        inv_make: itemData.inv_make,
        inv_model: itemData.inv_model,
        inv_year: itemData.inv_year,
        inv_price: itemData.inv_price,
    });
};

/* ***************************
 *  Process Inventory Item Deletion
 * ************************** */
invCont.deleteInventoryItem = async function (req, res, next) {
    const inv_id = parseInt(req.body.inv_id);
    let nav = await utilities.getNav();

    const deleteResult = await invModel.deleteInventoryItem(inv_id);

    if (deleteResult.rowCount) {
        req.flash("notice", "The vehicle was successfully deleted");
        res.redirect("/inv/");
    } else {
        req.flash("notice", "Delete failed. Please try again.");
        res.status(501).redirect(`/inv/delete/${inv_id}`);
    }
};

/* **************************
! ENHANCEMENTS
/* ************************** */

/* ***************************
 *  Build behicle comparison view
 * ************************** */
invCont.buildComparisonView = async function (req, res, next) {
    try {
        // Get vehicle IDs from session instead of query params
        const vehicleIds = req.session.comparison || [];

        // Handle empty comparison list
        if (vehicleIds.length === 0) {
            let nav = await utilities.getNav();
            return res.render("inventory/comparison", {
                title: "Vehicle Comparison",
                nav,
                vehicles: [],
                similarVehicles: [],
                errors: null,
            });
        }

        // Convert IDs to numbers if they're stored as strings
        const numericIds = vehicleIds.map((id) => parseInt(id));

        // Get vehicle data
        const vehicles = await invModel.getVehiclesForComparison(numericIds);

        if (!vehicles || vehicles.length === 0) {
            req.flash("notice", "No vehicles found for comparison");
            return res.redirect("/inv");
        }

        // Get similar vehicles based on the first vehicle's classification
        const similarVehicles = await invModel.getSimilarVehicles(
            vehicles[0].classification_id,
            vehicles[0].inv_id
        );

        let nav = await utilities.getNav();
        res.render("inventory/comparison", {
            title: "Vehicle Comparison",
            nav,
            vehicles,
            similarVehicles,
            errors: null,
        });
    } catch (error) {
        console.error("Error in buildComparisonView:", error);
        next(error);
    }
};

/* ***************************
 *  Add vehicle to comparison list
 * ************************** */
invCont.addToComparison = async function (req, res, next) {
    try {
        const { inv_id } = req.body;

        if (!inv_id) {
            req.flash("notice", "Invalid vehicle selection");
            return res.redirect("/inv/comparison");
        }

        // Initialize or get comparison list
        req.session.comparison = req.session.comparison || [];

        // Check if already in comparison
        if (req.session.comparison.includes(inv_id)) {
            req.flash("notice", "Vehicle already in comparison");
            return res.redirect("/inv/comparison");
        }

        // Check limit
        if (req.session.comparison.length >= 3) {
            req.flash("notice", "Maximum 3 vehicles allowed");
            return res.redirect("/inv/comparison");
        }

        // Add to comparison
        req.session.comparison.push(inv_id);

        // Save session explicitly
        await new Promise((resolve) => {
            req.session.save(resolve);
        });

        req.flash("notice", "Vehicle added to comparison");
        return res.redirect("/inv/comparison");
    } catch (error) {
        console.error("Error adding to comparison:", error);
        next(error);
    }
};

/* ***************************
 *  Remove vehicle from comparison
 * ************************** */
invCont.removeFromComparison = async function (req, res, next) {
    try {
        const { inv_id } = req.body;
        if (!inv_id) {
            req.flash("notice", "Invalid vehicle ID");
            return res.redirect("back");
        }

        // Get current comparison list
        let comparisonList = req.session.comparison || [];

        // Filter using the original ID format
        req.session.comparison = comparisonList.filter((id) => id !== inv_id);

        // Save session
        await new Promise((resolve) => req.session.save(resolve));

        req.flash("notice", "Vehicle removed from comparison");
        return res.redirect("/inv/comparison"); // Use explicit path instead of "back"
    } catch (error) {
        console.error("Error removing vehicle:", error);
        next(error);
    }
};

/* ********
! enhancements end
*********** */

/* ***************************
 *  Build error test function
 * ************************** */
invCont.triggerError = async function (req, res, next) {
    const error = new Error("Intentional 500 error for testing");
    error.status = 500;
    throw error;
};

module.exports = invCont;
