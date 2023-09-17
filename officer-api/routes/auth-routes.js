const express = require("express");
const router = express.Router();
const authControler = require("../controllers/Auth/auth-controller.js");

router.route("/register")
    .post(authControler.register());

router.route("/login")
    .get(authControler.authentication());

router.route("/dsauth")
    .get((req,res)=>{
        res.send("OK")
    })
    
module.exports = router;
