const openConnection = require("../../services/database");

exports.create = function (object) {
    return async (req, res) => {
        const {userData, ...data} = req.body

        let fields = Object.entries(data)
            .map((field) => {
                return field[0];
            })
            .join(", ");

        let values = Object.entries(data)
            .map((value) => {
                return `'${value[1]}'`;
            })
            .join(", ");

        const sql = `INSERT INTO ${object}(${fields}) VALUES(${values})`;
        try {
            const db = await openConnection();
            const resData = await db.run(sql, []);
            db.close();
            return res.status(200).json(resData);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    };
};

exports.get = function (object) {
    return async(req, res) => {
        const { _id } = req.query;
        const sql = `SELECT * FROM ${object} ${
            _id ? "WHERE _id = " + _id : ""
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
    };
};

exports.update = function (object) {
    return async (req, res) => {
        const { _id, ...data } = req.body.data;

        let fields = Object.entries(data).map((field) => {
            return `${field[0]} = '${field[1]}'`;
        });
        let sql = `UPDATE ${object} SET ${fields.join(
            ", "
        )} WHERE ${object}._id = ${_id}`;
        try {
            const db = await openConnection();
            const rows = await db.run(sql, []);
            db.close();
            return res.status(200).json(rows);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    };
}

exports.delete = function (object){
    return async (req, res) => {
        const _ids = req.body.data;
        const sql = `DELETE FROM ${object} WHERE _id IN (${_ids})`;
        try {
            const db = await openConnection();
            const rows = await db.run(sql, []);
            db.close();
            return res.status(200).json(rows || {});
        } catch (err) {
            console.log(err);
            if(err.errno == 19){
                return res.status(400).json("Error while deleting");
            }
            return res.status(500).json(err);
        }
    };
}

exports.deleteSoft = function (object){
    return async (req, res) => {
        const _ids = req.body.data;
        const sql = `UPDATE ${object} SET Active = 0 WHERE _id IN (${_ids})`;
        try {
            const db = await openConnection();
            const rows = await db.run(sql, []);
            db.close();
            return res.status(200).json(rows || {});
        } catch (err) {
            console.log(err);
            if(err.errno == 19){
                return res.status(400).json("Error while deleting");
            }
            return res.status(500).json(err);
        }
    };
}