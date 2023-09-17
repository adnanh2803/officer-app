const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.hashPasssword = async function(password){
    try{
        const hash = await bcrypt.hash(password, 10);
        return hash
    }catch(err){
        console.log(err)
    }
}

exports.authenticate = function(token) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded
    } catch (err) {
        throw new HttpError('Invalid or missing authorization token',401)
    }
};

exports.createToken = function (user){
    return jwt.sign(
        {
            ...user
        },
        process.env.JWT_SECRET,
        { expiresIn: Number(process.env.TOKEN_TIME) }
    );
}

exports.compareAndCreateToken = async function (userData,password, storedPassword){
    if(!password || !storedPassword) throw new HttpError('Both passwords must be provided',401)
    const res = await bcrypt.compare(password, storedPassword)
    if(!res) throw new HttpError("Email and/or password is invalid",401);
    return exports.createToken(userData);
}
