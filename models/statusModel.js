const mongoose = require('mongoose');

const statusSchema = new mongoose.Schema({
    input : {
        type : String
    },
    tag : {
        type : String
    },
    case : {
        type : String
    },
    time : {
        type : Date
    },
    noSatellites : {
        type : Number
    },
    gps : {
        type : [Number]
    },
    speed : {
        type : Number
    },
    cellTower : {
        type : Array
    },
    info_serial_no : {
        type : Number
    },
    output : {
        type : String
    },
    imei : {
        type : String
    },
    socket : {
        type : String
    },
    device : {
        type : String
    },
    client : {
        type : String
    },
    battery : {
        type : Number
    },
    createdAt : {
        type : Date
    },
});
const Status = mongoose.model("Status" , statusSchema);


module.exports = Status;