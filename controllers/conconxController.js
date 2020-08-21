const Device = require('../models/deviceSchema');
const Status = require('../models/statusModel');
const { getDistance } =  require('geolib');
module.exports = {
    getAllDevices : async (req , res) => {
        try{
            let limit = 10;
            let query = Device.find().limit(limit);
            if(req.query.page && req.query.page > 0){
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
            let query = Status
                .find({"imei" : req.params.deviceId })
                .select("_id gps imei time device client");

            if(req.query.page &&  req.query.page > 0){
                skip = (req.query.page - 1) * limit;
                query.skip(skip);
            } else {
                query.skip(0);
            }
            const result = await query.limit(limit);
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
    },

    calculateHalts : async (req , res) => {
        try{

            let query = Status
                .find(
                        {
                            imei : req.params.deviceId,
                            gps : {$ne : null},
                            createdAt : {$ne : null}
                        }
                    )
                .select('gps createdAt')
                .sort('_id')
                .lean()
                .limit(60000)
            let data = await query;
            let count = 0;
            flag = false;
            for(let i = 1 ; i < data.length ; i++){
                let date1 = new Date(data[i-1].createdAt)
                let date2 = new Date(data[i].createdAt)
                let diff = date1.getTime() - date2.getTime()
                diff /= 60;
                let minutes = Math.abs(Math.round(diff));
                if(minutes > 15){
                    let distance = (getDistance(
                        { latitude: data[i-1].gps[0], longitude: data[i-1].gps[1] },
                        { latitude: data[i].gps[0], longitude: data[i].gps[1] }
                    ));
                    if(distance <= 100){
                        if(!flag){
                            flag = true;
                            count+=1;
                        }
                    } else {
                        flag = false;
                    }
                }

            }

            res.status(200).json({
                "status" : "success",
                "length" : data.length,
                "halts" : count
            })
        } catch (e) {
            console.log(`concoxController -> calculateHalts ${e}`);
            res.status(400).json({
                "status" : "failed",
                "message" : e.message
            })
        }
    }

};