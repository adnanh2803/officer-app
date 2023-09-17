const express = require("express");
const router = express.Router();
const verifyUser = require("../middleware/auth-middleware.js");
const applicationSettingsController = require("../controllers/ApplicationSettings/application-settings-controller.js");

router
    .route("/application-settings")
    .all(verifyUser('ApplicationSettings'))
    .get(applicationSettingsController.get('ApplicationSettings'))
    .post(applicationSettingsController.create('ApplicationSettings'))
    .put(applicationSettingsController.update('ApplicationSettings'))
    .delete(applicationSettingsController.delete('ApplicationSettings'));

module.exports = router