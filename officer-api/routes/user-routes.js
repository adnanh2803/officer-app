const express = require("express");
const router = express.Router();
const verifyUser = require("../middleware/auth-middleware.js");
const coreControler = require("../controllers/Core/core-controller.js");
const userControler = require("../controllers/User/user-controller.js")

router.route("/user")
    .all(verifyUser('User'))
    .get(userControler.get('User'))
    .put(coreControler.update('User'))
    .delete(coreControler.delete('User'));

router.route("/user/reviewers")
    .all(verifyUser('User'))
    .get(userControler.getReviewers())
    .put(userControler.updateReviewers());

router.route("/user/image")
    .all(verifyUser('UserSettings'))
    .get(userControler.getImage())
    .post(userControler.uploadImage(), userControler.postUploadImage())
    
module.exports = router;
