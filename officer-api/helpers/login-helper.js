const openConnection = require("../services/database");
const authHelper = require("../helpers/authentication-helper")
const userExists = async function(username){
    const sql = `SELECT COUNT(1) as count FROM User WHERE Username = '${username}'`;
    const db = await openConnection();
    const userData = await db.get(sql, []);
    await db.close();
    return userData.count > 0?true:false;
}

const getUserByUsername = async function (username) {
    const sql = `SELECT * FROM User WHERE Username = '${username}'`;
    const db = await openConnection();
    const userData = await db.get(sql, []);
    db.close();
    return userData;
};

const getEmployeeByEmail = async function (email) {
    const sql = `SELECT * FROM Employee WHERE Email = ?`;
    const db = await openConnection();
    const employeData = await db.get(sql, [email]);
    if(employeData == null) throw new HttpError(`Employee with email: ${email} does not exist`,400)
    await db.close();
    return employeData;
};

const getUserFromDb = async function (Username, privilages=false) {
    const sql = `SELECT * FROM vw_UserRole${privilages?'Privilages':''} WHERE Username = '${Username}'`;
    const db = await openConnection();
    const userData = await db.get(sql, []);
    db.close();
    return userData;
};

const validateEmployee = async function (Email) {
    const sql = `SELECT * FROM Employee WHERE Email = '${Email}'`;
    const db = await openConnection();
    const employee = await db.get(sql, []);
    db.close();
    return employee?._id;
};

const assignEmployeeToUser = async function (EmployeeId, UserId) {
    const sql = `UPDATE User SET EmployeeId = ${EmployeeId} WHERE User._id = '${UserId}'`;
    const db = await openConnection();
    await db.run(sql, []);
    db.close();
};

const getRoleByName = async function (roleName) {
    const sql = `SELECT Role._id FROM Role WHERE Role.RoleName = '${roleName}'`;
    const db = await openConnection();
    const role = await db.get(sql, []);
    db.close();
    return role?._id;
};

const createUser = async function (username, password, employeeId, roleName) {
    const passwordHash = await authHelper.hashPasssword(password);
    if (!passwordHash) throw new HttpError("Unable to hash password", 500);
    const roleId = await getRoleByName(roleName);

    const sql = `INSERT INTO User(Username, Password, RoleId, EmployeeId) VALUES('${username}', '${passwordHash}', ${roleId}, ${employeeId})`;
    const db = await openConnection();
    await db.run(sql, []);
    const userData = await getUserByUsername(username);
    await assignEmployeeToUser(employeeId, userData._id)
    db.close();
    return userData
};

module.exports = {
    getUserByUsername,
    getUserFromDb,
    validateEmployee,
    assignEmployeeToUser,
    createUser,
    userExists,
    getEmployeeByEmail
};
