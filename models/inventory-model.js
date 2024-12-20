const pool = require("../database/");

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
    return await pool.query(
        "SELECT * FROM public.classification ORDER BY classification_name"
    );
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i 
        JOIN public.classification AS c 
        ON i.classification_id = c.classification_id 
        WHERE i.classification_id = $1`,
            [classification_id]
        );
        return data.rows;
    } catch (error) {
        console.error("getclassificationsbyid error " + error);
    }
}

/* ***************************
 *  Get vehicle specific data by inv_id
 * ************************** */
async function getInventoryByInvId(inv_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i 
            WHERE i.inv_id = $1`,
            [inv_id]
        );
        return data.rows[0];
    } catch (error) {
        console.error("getinventorybyid error " + error);
    }
}

/* ***************************
 *  Add new classification
 * ************************** */
async function addClassification(classification_name) {
    try {
        const sql =
            "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *";
        const data = await pool.query(sql, [classification_name]);
        return data;
    } catch (error) {
        console.error("addClassification error " + error);
        return error.message;
    }
}

/* ***************************
 *  Add new inventory item
 * ************************** */
async function addInventory(
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
) {
    try {
        const sql =
            "INSERT INTO public.inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *";

        const data = await pool.query(sql, [
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
        ]);
        return data.rowCount;
    } catch (error) {
        console.error("addInventory error " + error);
        return error.message;
    }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
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
    classification_id
) {
    try {
        const sql =
            "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *";
        const data = await pool.query(sql, [
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
            inv_id,
        ]);
        return data.rows[0];
    } catch (error) {
        console.error("model error: " + error);
    }
}

/* ***************************
 *  Delete Inventory Item
 * ************************** */
async function deleteInventoryItem(inv_id) {
    try {
        const sql = "DELETE FROM public.inventory WHERE inv_id = $1";
        const data = await pool.query(sql, [inv_id]);
        return data;
    } catch (error) {
        console.error("deleteInventory error: " + error);
        throw new Error("Delete Inventory Error");
    }
}

/* ***************************
 *  Get multiple vehicles by array of IDs for comparison
 * ************************** */
async function getVehiclesForComparison(vehicleIds) {
    try {
        // Validate input using Array.isArray instead of util.isArray
        if (!Array.isArray(vehicleIds) || vehicleIds.length === 0) {
            throw new Error("Invalid vehicle IDs provided");
        }

        const sql = "SELECT * FROM public.inventory WHERE inv_id = ANY($1)";
        const data = await pool.query(sql, [vehicleIds]);
        return data.rows;
    } catch (error) {
        console.error("getVehiclesForComparison error:", error);
        throw error;
    }
}

/* ***************************
 *  Get similar vehicles in same classification
 * ************************** */
async function getSimilarVehicles(classificationId, currentVehicleId) {
    try {
        const sql = `SELECT * FROM public.inventory
        WHERE classification_id = $1
        AND inv_id != $2 
        ORDER BY inv_make, inv_model 
        LIMIT 3`;
        const data = await pool.query(sql, [
            classificationId,
            currentVehicleId,
        ]);
        return data.rows;
    } catch (error) {
        console.error("getSimilarVehicles error: " + error);
        return new Error("No similar vehicles found!");
    }
}

module.exports = {
    getClassifications,
    getInventoryByClassificationId,
    getInventoryByInvId,
    addClassification,
    addInventory,
    updateInventory,
    deleteInventoryItem,
    getVehiclesForComparison,
    getSimilarVehicles,
};
