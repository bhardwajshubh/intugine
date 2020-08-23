const Device = require('../models/deviceSchema');
const Status = require('../models/statusModel');
const { calculateTimeDifference } = require('./../utils/commons');
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
            let results = [];
            let objToPush = {};
            for(let i = 1 ; i < data.length ; i++){

                //calculating time difference between two intervals
                let minutes = calculateTimeDifference(data[i-1].createdAt , data[i].createdAt);

                //if interval is > 15 minutes
                if(minutes > 15){

                    //calculating geoDistance between two coordinates
                    let distance = (getDistance(
                        { latitude: data[i-1].gps[0], longitude: data[i-1].gps[1] },
                        { latitude: data[i].gps[0], longitude: data[i].gps[1] }
                    ));

                    //if distance is > 100 meter
                    if(distance <= 100){
                        //and if the person is there for the first time
                        if(!flag){
                            //add the initTime property,  gps-coordinates in the object
                            objToPush.initTime = data[i-1].createdAt;
                            objToPush.gpsCoordinates = data[i-1].gps;
                            flag = true;

                            //increase the halt count
                            count+=1;
                        }
                        //if the person is still there, add finalTime in the object
                        objToPush.finalTime = data[i].createdAt;
                    } else {

                        if(flag){
                            //if the person left that place calculate the final time between initial and final timestamp
                            //and push the object in result array
                            objToPush.minutesOFHalt = calculateTimeDifference(objToPush.initTime, objToPush.finalTime);
                            results.push(objToPush);

                            //clear the object for new fresh run
                            objToPush = {};
                            flag = false;
                        }

                    }
                }

            }

            res.status(200).json({
                "status" : "success",
                "length" : results.length,
                "halts" : results
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