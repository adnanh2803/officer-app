const openConnection = require("../../services/database");
const authHelper = require("../../helpers/authentication-helper");
const path = require("path");
const fs = require("fs");
const mime = require("mime")
const mimeT = require("mime-types");
const multer = require("multer");

// Set up storage for uploaded files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "static/images");
    },
    filename: function (req, file, cb) {
        const fileName = JSON.parse(JSON.stringify(req.body)).fileName;
        let ext = mimeT.extension(file.mimetype);
        cb(null, `${fileName}.${ext}`);
    },
});

// Create multer instance
const upload = multer({ storage: storage });

exports.get = function () {
    return async (req, res) => {
        const { _id } = req.query;
        const sql = `SELECT * FROM vw_UserRole ${
            _id ? "WHERE _id = " + _id : ""
        }`;
        try {
            const db = await openConnection();
            const rows = await db.all(sql, []);
            db.close();
            return res.status(200).json(rows || {});
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    };
};

exports.getReviewers = function () {
    return async (req, res) => {
        const { notAssigned } = req.query;
        const isReviewer = notAssigned == 'true'?'0':'1'
        const reviewersStmt = "SELECT _id, FullName, Email, Position FROM vw_UserRole WHERE IsReviewer = ?"
        try {
            const db = await openConnection();
            const reviewers = await db.all(reviewersStmt, [isReviewer]);
            db.close();
            return res.status(200).json(reviewers || []);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    };
};

exports.update = function () {
    return async (req, res) => {
        const { _id, ...data } = req.body.data;

        let fields = Object.entries(data).map((field) => {
            return `${field[0]} = '${field[1]}'`;
        });
        let sql = `UPDATE User SET ${fields.join(
            ", "
        )} WHERE User._id = ${_id}`;
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
};
exports.updateReviewers = function () {
    return async (req, res) => {
        const { userIds, isReviewer } = req.body;
        const updateReviewerStmt = "UPDATE User SET IsReviewer = ? WHERE _id IN (?)"
        try {
            const db = await openConnection();
            await db.run(updateReviewerStmt, [isReviewer,userIds]);
            db.close();
            return res.status(200).json("Reviewers updated");
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    };
};

exports.delete = function () {
    return async (req, res) => {
        const _ids = req.body.data;
        const sql = `DELETE FROM User WHERE _id IN (${_ids})`;
        try {
            const db = await openConnection();
            const rows = await db.run(sql, []);
            db.close();
            return res.status(200).json(rows || {});
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    };
};
//route: /register
exports.register = function () {
    return async (req, res) => {
        if (!req.body.Username || !req.body.Password) {
            return res.status(400).json({
                Message:
                    "Invalid data for login. Make sure that body is JSON Object and it contains username and password keys",
            });
        }

        const { Username, Password } = req.body;

        const passwordHash = await authHelper.hashPasssword(Password);
        if (!passwordHash)
            return res.status(500).json({
                err: "Internal service error: Could not create password hash",
            });
        const sql = `INSERT INTO User(${fields}, Username, Password, Email, RoleId) VALUES('${values}', '${Username}', '${passwordHash}', 'adnan.hodzic@unipu.hr',1)`;
        const getUser = `SELECT * FROM vw_UserRole WHERE Username = '${Username}'`;
        try {
            const db = await openConnection();
            await db.run(sql, []);
            const userData = await db.get(getUser, []);
            db.close();
            let newUser = { Username, userData };
            let newToken = authHelper.createToken(newUser);
            return res.status(200).json({
                Token: newToken,
                User: userData,
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    };
};

exports.getImage = function () {
    return async (req, res) => {
        const {_id, FullName} = req.body.userData
        const directoryPath = path.resolve(__dirname + `/../../static`);
        var filePath = ''
        var fileName = fs.readdirSync(directoryPath + '/images').find(file => path.parse(file).name === `${_id}`);
        if(fileName === undefined) {
            let placeholder = fs.readdirSync(directoryPath).find(file =>path.parse(file).name == 'placeholder');
            filePath = directoryPath + '/' + placeholder;
        }else{
            filePath= directoryPath + '/images/' + fileName;
        }
        
        var mimetype = mime.getType(filePath);
      
        res.setHeader('Content-disposition', 'attachment; filename=' + fileName);
        res.setHeader('Content-type', mimetype);
      
        var filestream = fs.createReadStream(filePath);
        filestream.pipe(res);
    };
};

exports.uploadImage = function () {
    return upload.single("file");
};

exports.postUploadImage = function () {
    return async (req, res) => {
        res.send("OK");
    };
};
