const authHelper = require("../../helpers/authentication-helper");
const {getUserFromDb, getUserByUsername, validateEmployee, createUser, userExists, getEmployeeByEmail} = require('../../helpers/login-helper.js')

exports.register = function () {
    return async (req, res) => {
        const {activationCode, password, email} = req.body;
        if (!activationCode || !password || !email) throw new HttpError("Invalid register data",400);
        if(await userExists(email)) throw new HttpError("User already exists", 400);
        try{
        const {ActivationCode,_id} = await getEmployeeByEmail(email);

        if(activationCode != ActivationCode) throw new HttpError("Invalid Activation Code", 401);

        const userData = await createUser(email,password,_id,'ADMIN')

        return res.status(200).json(userData);
        }catch(error){
           return res.status(error.statusCode).send(error.message)
        } 
    }
}

exports.authentication = function () {
    return async (req, res) => {
        const { password, email } = req.query;
        if (!password || !email) throw new HttpError("Invalid data for login. Make sure that body is JSON Object and it contains email and password keys",400);
        try {
            let userData = await getUserByUsername(email);

            if(userData === undefined){
                if(!email) throw new HttpError(`There is no user with email: ${email}`,400)
                const employeeId = await validateEmployee(email);
                if(employeeId === undefined) throw new HttpError(`Could not find employee with email: ${email}`, 401);
                userData = await createUser(email, password, employeeId, 'EMPLOYEE')
            }
            const userFullData = await getUserFromDb(email,true);
            const newToken = await authHelper.compareAndCreateToken(
                userFullData,
                password,
                userData?.Password
            );
            return res.status(200).json({
                Token: newToken,
                User: userFullData,
            });
        } catch (err) {
            console.log(err);
            return res.status(err.statusCode || 500).json(err.message);
        }
    };
};