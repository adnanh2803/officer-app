const authHelper = require("../helpers/authentication-helper.js");
const authorize = require("../helpers/authorization-helper.js");
function paraseToken(headers) {
    if (headers.authorization === undefined)
        throw new HttpError("Missing authorization headers", 401);
    const headerToken = headers.authorization;
    const bearerToken = headerToken.split(" ");
    const JWToken = bearerToken[1];
    return JWToken;
}

module.exports = function verifyUser(object) {
    return async (req, res, next) => {
        try {
            const token = paraseToken(req.headers);
            const user = authHelper.authenticate(token);

            if (user == null) {
                throw new HttpError("Invalid token", 401);
            }
            req.body.userData = user;
            const isAuthorized = await authorize(
                user.RoleId,
                req.method,
                object
            );
            if (!isAuthorized)
                return res.status(403).json({ error: "User is unauthorized" });
            next();
        } catch (error) {
            console.log(error);
            res.status(error.statusCode).json({ message: error.message });
        }
    };
};
