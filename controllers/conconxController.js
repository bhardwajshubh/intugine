const Device = require('../models/deviceSchema');
const Status = require('../models/statusModel');

module.exports = {
    getAllDevices : async (req , res) => {
        try{
            let limit = 10;
            let query = Device.find({}).limit(limit);
            if(req.query.page && (req.query.page !== null || req.query.page !== 0)){
                skip = (req.query.page - 1) * limit;
                query.skip(skip);
            }
            const result = await query;
            res.status(200).json({
                "status" : "success",
                "length" : result.length,
                result
            })
        } catch (e) {
            console.log(`concoxController -> getAllDevices ${e}`);
            res.status(400).json({
                "status" : "failed",
                "message" : e.message
            })
        }
    },

    getDeviceLocationById : async (req , res) => {
        try{
            let limit = 10;
            let query = Status.find({}).limit(limit);
            // if(req.query.page && (req.query.page !== null || req.query.page !== 0)){
            //     skip = (req.query.page - 1) * limit;
            //     query.skip(skip);
            // }
            const result = await query;
            res.status(200).json({
                "status" : "success",
                "length" : result.length,
                result
            })
        } catch (e) {
            console.log(`concoxController -> getDeviceLocationById ${e}`);
            res.status(400).json({
                "status" : "failed",
                "message" : e.message
            })
        }
    }


};