const fsPromises = require('fs').promises
const jwt = require('jsonwebtoken');
module.exports = {
    login : async (req , res) => {
        try{
            const bodyData = req.body;
            const userData = await fsPromises.readFile(`${__dirname}/../users.json`, 'utf8');
            let data = JSON.parse(userData);
            if(bodyData.userId in data){
                if(data[bodyData.userId].password === bodyData.password){
                    const token = await jwt.sign({"userId" : bodyData.userId} , process.env.JWT_SECRET , {expiresIn: "1h"});
                    res.header('authauthorization' , `Bearer ${token}`);
                    res.status(200).json({
                        "status" : "success",
                        "message" : "logged in"
                    })
                } else {
                    throw new Error("Password incorrect");
                }
            } else{
                throw new Error("No user found");
            }

        } catch (e) {
            console.log(`authController -> login controller ${e}`);
            res.status(403).json({
                "status" : "failed",
                "error" : e.message
            })
        }
    }
}