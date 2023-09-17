const express = require("express");
const router = express.Router();
const verifyUser = require("../middleware/auth-middleware.js");
const assetControler = require("../controllers/Asset/asset-controller");
const assetGroupControler = require("../controllers/Asset/assetgroup-controller");

router
    .route("/asset")
    .all(verifyUser('Asset'))
    .get(assetControler.get())
    .post(assetControler.create('Asset'))
    .put(assetControler.update('Asset'))
    .delete(assetControler.delete('Asset'));

router
    .route("/asset/group")
    .all(verifyUser('AssetGroup'))
    .get(assetGroupControler.get('AssetGroup'))
    .post(assetGroupControler.create('AssetGroup'))
    .put(assetGroupControler.update('AssetGroup'))
    .delete(assetGroupControler.delete('AssetGroup'));

module.exports = router;
