const coreController = require("../Core/core-controller");
const openConnection = require("../../services/database");

function uuidv4() {
    return "'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'"
    .replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0, 
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
exports.get = coreController.get
exports.create = function (object) {
    return async (req, res) => {
        const {userData, ...data} = req.body

        let fields = Object.entries(data)
            .map((field) => {
                return field[0];
            })
        fields.push('ActivationCode')
        fields.join(", ");

        let values = Object.entries(data)
            .map((value) => {
                return `'${value[1]}'`;
            })
        values.push(uuidv4())
        values.join(", ");


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
exports.update = coreController.update
exports.delete = coreController.deleteSoft