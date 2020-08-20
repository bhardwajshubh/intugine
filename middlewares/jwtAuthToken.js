const jwt = require('jsonwebtoken');
const fsPromises = require('fs').promises
module.exports = {
    authCheck : async (req , res , next) => {
        try{
            let token = req.headers.authorization.split(" ")[1];
            const tokenData = await jwt.verify(token , process.env.JWT_SECRET);
            const userData = await fsPromises.readFile(`${__dirname}/../users.json`, 'utf8');
            let data = JSON.parse(userData);
            if(tokenData.userId in data){
                next()
            } else {
                throw new Error("No user found");
            }
        } catch (e) {
            console.log(`authcheck middeleware ${e}`);
            res.status(403).json({
                'status' : 'failed',
                'error' : e.message
            })
        }
    }
}