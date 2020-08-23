

module.exports = {
    calculateTimeDifference : (data1 , data2) => {
        let date1 = new Date(data1)
        let date2 = new Date(data2)
        let diff = date1.getTime() - date2.getTime()
        diff /= 60;
        return Math.abs(Math.round(diff));
    }
}