const express = require("express");
const router = express.Router();
const verifyUser = require("../middleware/auth-middleware.js");
const assetControler = require("../controllers/Employee/employee-controller");

router
    .route("/employee")
    .all(verifyUser('Employee'))
    .get(assetControler.get('vw_UserRole'))
    .post(assetControler.create('Employee'))
    .put(assetControler.update('Employee'))
    .delete(assetControler.delete('Employee'));
module.exports = router;
