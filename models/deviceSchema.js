const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
    id : {
        type : String
    },
    imei : {
        type : String
    },
    sim : {
        type : String
    },
    tel : {
        type : String
    },
    createdAt : {
        type : Date
    },
    client : {
        type : String
    },
});

const Device = mongoose.model('Device' , deviceSchema);

module.exports = Device;