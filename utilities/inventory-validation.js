const utilities = require(".");
const { body, validationResult } = require("express-validator");
const validate = {};
const inventoryModel = require("../models/inventory-model");

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
