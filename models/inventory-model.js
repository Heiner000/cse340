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

module.exports = {
    getClassifications,
    getInventoryByClassificationId,
    getInventoryByInvId,
    addClassification,
    addInventory,
};
