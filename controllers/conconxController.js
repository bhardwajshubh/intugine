

module.exports = {
    getAllDevices : async (req , res) => {
        res.status(200).json({
            "status" : "success",
        })
    }
};