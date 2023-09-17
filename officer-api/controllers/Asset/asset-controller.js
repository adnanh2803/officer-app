const coreController = require("../Core/core-controller");
const openConnection = require("../../services/database");
exports.get = function(){ return async (req,res) =>{
    const { _id, unassigned } = req.query;
    const object = unassigned ? 'vw_UnassignedAssets':'Asset'

    const sql = `SELECT * FROM ${object} ${
        _id ? "WHERE _id = " + _id + "AND Active = 1": "WHERE Active = 1"
    }`;
    try {
        const db = await openConnection();
        const rows = await db.all(sql, []);
        db.close();
        return res.status(200).json(rows);
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
}}
exports.create = coreController.create
exports.update = coreController.update
exports.delete = coreController.deleteSoft